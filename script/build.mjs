import { readdir, writeFile } from 'fs/promises'
import { basename, dirname, extname, join } from 'path'

const buildStartTime = Date.now()
console.log('Starting build...')

const rootDirectory = dirname(
 dirname(import.meta.url.replace(/^file\:/, ''))
)

const dir = join(rootDirectory, 'public', 'content')

const files = await readdir(dir)

const publishedTimes = []
const draftTimes = []

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
 await import(path)
 const postData = globalThis.content[time]
 if (!postData) {
  console.warn(
   `Post with file name was not loaded: ${JSON.stringify(
    file
   )}`
  )
  continue
 }
 if (postData.published) {
  publishedTimes.push(time)
 } else {
  draftTimes.push(time)
 }
}

console.log(
 `Found ${publishedTimes.length} published post${
  publishedTimes.length === 1 ? '' : 's'
 }`
)
console.log(
 `Found ${draftTimes.length} draft post${
  draftTimes.length === 1 ? '' : 's'
 }`
)

await writeFile(
 join(rootDirectory, 'public', 'published.js'),
 `globalThis.publishedTimes = ${JSON.stringify(
  publishedTimes,
  null,
  1
 )}`
)
await writeFile(
 join(rootDirectory, 'public', '.drafts.js'),
 `globalThis.draftTimes = ${JSON.stringify(
  draftTimes,
  null,
  1
 )}`
)
console.log(
 `Build complete: ${Date.now() - buildStartTime}ms`
)
