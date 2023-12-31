import { access, readdir, writeFile } from 'fs/promises'
import { basename, dirname, extname, join } from 'path'

const buildStartTime = Date.now()
console.log('Starting build...')

const rootDirectory = dirname(
 dirname(import.meta.url.replace(/^file\:/, ''))
)

async function fileExists(filename) {
 try {
  await access(filename)
  return true
 } catch {
  return false
 }
}

async function generateOGFile(post) {
 const shareHTMLFileName = post.id.toString(10) + '.html'
 const filename = join(
  rootDirectory,
  'public',
  'journal',
  'entry',
  shareHTMLFileName
 )

 if (await fileExists(filename)) {
  console.log(
   `OG file already exists, skipping: ${filename}`
  )
  return
 }

 const shareUrl = `https://nateferrero.com/journal/entry/${shareHTMLFileName}`
 const url = `https://nateferrero.com/#/journal/entry/${post.time}`

 const html = `<!DOCTYPE html>
<html>
 <head>
   <title>${post.title}</title>
   <meta property="og:type" content="article">
   <meta property="og:site_name" content="Nathanael Ferrero">
   <meta property="og:url" content="${shareUrl}">
   <meta property="og:title" content="${post.title}" />
   <meta property="og:description" content="${
    post.snippet
   }" />
   ${
    post.image
     ? `<meta property="og:image" content="${post.image}" />`
     : ''
   }
 </head>
 <body onload="window.location.href='${url}'">
   Redirecting...
 </body>
</html>
`

 await writeFile(filename, html)
}

const dir = join(rootDirectory, 'public', 'content')

const files = await readdir(dir)

const published = []
const drafts = []

for (const file of files) {
 const path = `${dir}/${file}`
 const name = basename(file, extname(file))
 const time = parseInt(name)
 if (time.toString(10) !== name) {
  console.warn(
   `Post with file name not expected: ${JSON.stringify(
    file
   )}`
  )
  continue
 }
 const postData = {
  ...((await import(path)) ?? {}),
  id: time,
 }
 if (!postData.title) {
  console.warn(
   `Post was missing a title: ${JSON.stringify(file)}`
  )
  continue
 }
 if (postData.published) {
  await generateOGFile(postData)
  published.push(postData)
 } else {
  drafts.push(postData)
 }
}

console.log(
 `Found ${published.length} published post${
  published.length === 1 ? '' : 's'
 }`
)

console.log(
 `Found ${drafts.length} draft post${
  drafts.length === 1 ? '' : 's'
 }`
)

await writeFile(
 join(rootDirectory, 'public', 'published.json'),
 JSON.stringify(published, null, 1)
)

await writeFile(
 join(rootDirectory, 'public', '.drafts.json'),
 JSON.stringify(drafts, null, 1)
)

console.log(
 `Build complete: ${Date.now() - buildStartTime}ms`
)
