import { readdir, writeFile } from 'fs/promises'
import { basename, dirname, extname, join } from 'path'

const buildStartTime = Date.now()
console.log('Starting build...')

const rootDirectory = dirname(
 dirname(import.meta.url.replace(/^file\:/, ''))
)

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
 const postData = await import(path)
 if (!postData) {
  console.warn(
   `Post with file name was not loaded: ${JSON.stringify(
    file
   )}`
  )
  continue
 }
 if (postData.published) {
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
