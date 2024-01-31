globalThis.journalNetwork = {
 content() {
  function sortByTime(a, b) {
   return b.time - a.time
  }
  let loaded = false
  const cache = {
   drafts: [],
   published: [],
   allByTime: new Map(),
  }
  async function loadDrafts() {
   try {
    const draftsResponse = await fetch('/.drafts.json')
    const drafts = await draftsResponse.json()
    cache.drafts.push(...drafts.sort(sortByTime))
    for (const post of drafts) {
     cache.allByTime.set(post.time, post)
    }
   } catch (e) {
    console.warn('Error reading /.drafts.json', e)
   }
  }
  async function loadPublished() {
   try {
    const publishedResponse = await fetch(
     '/published.json?t=' + Date.now()
    )
    const published = await publishedResponse.json()
    cache.published.push(...published.sort(sortByTime))
    for (const post of published) {
     cache.allByTime.set(post.time, post)
    }
   } catch (e) {
    console.warn('Error reading /published.json', e)
   }
  }
  return {
   async load() {
    if (loaded) {
     return cache
    }
    await Promise.all([loadPublished(), loadDrafts()])
    loaded = true
    return cache
   },
  }
 },
 markdownToHtml(text) {
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

  // Lists
  let inList = false

  text = text
   .split('\n')
   .map((line) => {
    if (/^- /.test(line)) {
     if (!inList) {
      inList = true
      return `<ul>\n<li>${line.replace(/^- /, '')}</li>`
     } else {
      return `<li>${line.replace(/^- /, '')}</li>`
     }
    }

    if (inList) {
     inList = false
     return `</ul>\n${line}`
    }

    return line
   })
   .join('\n')

  if (inList) {
   text += '\n</ul>'
  }

  let inParagraph = false

  text = text
   .split('\n')
   .map((line) => {
    if (line.trim() === '') {
     if (inParagraph) {
      inParagraph = false
      return '</p>'
     }
    } else if (/^<\/?/i.test(line)) {
     if (inParagraph) {
      inParagraph = false
      return '</p>\n' + line
     } else {
      return line
     }
    } else {
     if (!inParagraph) {
      inParagraph = true
      return '<p>' + line
     } else {
      return line
     }
    }
   })
   .join('\n')

  if (inParagraph) {
   text += '</p>'
  }

  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')

  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<i>$1</i>')

  // Links
  text = text.replace(
   /\[([^\]]+)\]\(([^\)]+)\)/g,
   '<a target="_blank" href="$2">$1</a>'
  )

  return text
 },
 renderPostHead(post) {
  const article = document.createElement('article')

  if (!post.published) {
   article.classList.add('draft')
  }

  const copyButton = document.createElement('button')
  copyButton.textContent = '\u{1F4CB}'
  copyButton.classList.add('copy')
  copyButton.setAttribute(
   'title',
   'Copy URL to share this post'
  )

  copyButton.addEventListener('click', () => {
   navigator.clipboard.writeText(
    `https://nateferrero.com/journal/entry/${post.id}.html`
   )
  })

  article.appendChild(copyButton)

  const h1 = document.createElement('h1')
  const titleLink = document.createElement('a')
  titleLink.href = `/#/journal/entry/${post.time}`
  titleLink.textContent = post.title
  h1.appendChild(titleLink)

  const date = new Date(post.time)
  const dateTime = document.createElement('p')
  dateTime.classList.add('time')
  dateTime.textContent =
   (post.published ? 'Published ' : 'Draft ') +
   date
    .toLocaleString()
    .replace(/:\d\d\s/, '')
    .toLowerCase()

  const tagsDiv = document.createElement('div')
  tagsDiv.classList.add('tags')
  post.tags.forEach((tag) => {
   const tagLink = document.createElement('a')
   tagLink.textContent = tag
   tagLink.href = `/#/journal/tag/${encodeURIComponent(
    tag
   )}`
   tagsDiv.appendChild(tagLink)
  })

  article.append(h1, tagsDiv, dateTime)

  return article
 },
 renderPost(post) {
  const article =
   globalThis.journalNetwork.renderPostHead(post)

  const content = document.createElement('div')
  const renderedMarkdown =
   globalThis.journalNetwork.markdownToHtml(
    post.content.trim()
   )
  // console.log(renderedMarkdown)
  content.innerHTML = renderedMarkdown

  article.append(content)

  return article
 },
 renderPosts(posts) {
  const container = document.createElement('div')

  posts.forEach((post) => {
   const article =
    globalThis.journalNetwork.renderPostHead(post)
   const snippet = document.createElement('p')
   snippet.classList.add('snippet')
   snippet.textContent = post.snippet

   if (post.snippet?.length) {
    article.appendChild(snippet)
   }

   container.appendChild(article)
  })

  return container
 },
 viewEntry(time) {
  const container = document.createElement('div')
  const message = document.createElement('p')
  message.textContent = 'Loading journal...'
  container.appendChild(message)
  const content = globalThis.journalNetwork.content()
  content.load().then((posts) => {
   container.removeChild(message)
   const post = posts.allByTime.get(time)
   if (!post) {
    message.textContent = 'Entry not found'
    container.appendChild(message)
    return
   }
   container.appendChild(
    globalThis.journalNetwork.renderPost(post)
   )
  })
  return container
 },
 view() {
  const container = document.createElement('div')
  const message = document.createElement('p')
  message.classList.add('message')
  message.textContent = 'Loading journal...'
  container.appendChild(message)
  const content = globalThis.journalNetwork.content()
  content.load().then((posts) => {
   if (posts.published.length === 1) {
    message.textContent = `There is one published entry`
   } else {
    message.textContent = `There are ${
     posts.published.length || 'no'
    } published entries`
   }
   if (posts.drafts.length) {
    message.textContent += ` (and ${
     posts.drafts.length
    } draft${posts.drafts.length === 1 ? '' : 's'})`
    container.appendChild(
     globalThis.journalNetwork.renderPosts(posts.drafts)
    )
   }
   if (posts.published.length) {
    container.appendChild(
     globalThis.journalNetwork.renderPosts(posts.published)
    )
   }
  })
  return container
 },
 viewTag(tag) {
  const container = document.createElement('div')
  const message = document.createElement('p')
  message.classList.add('message')
  message.textContent = 'Loading journal...'
  container.appendChild(message)
  const content = globalThis.journalNetwork.content()
  content.load().then((_posts) => {
   const posts = {
    drafts: _posts.drafts.filter((x) =>
     x.tags.includes(tag)
    ),
    published: _posts.published.filter((x) =>
     x.tags.includes(tag)
    ),
   }
   if (posts.published.length === 1) {
    message.textContent = `There is one published entry`
   } else {
    message.textContent = `There are ${
     posts.published.length || 'no'
    } published entries`
   }
   if (posts.drafts.length) {
    message.textContent += ` (and ${
     posts.drafts.length
    } draft${posts.drafts.length === 1 ? '' : 's'})`
    container.appendChild(
     globalThis.journalNetwork.renderPosts(posts.drafts)
    )
   }
   message.textContent += ` with tag ${JSON.stringify(tag)}`
   if (posts.published.length) {
    container.appendChild(
     globalThis.journalNetwork.renderPosts(posts.published)
    )
   }
  })
  return container
 },
}
