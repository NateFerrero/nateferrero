import { writeFile } from 'fs/promises'
import { join } from 'path'
import { dirname } from 'path'

const rootDirectory = dirname(
 dirname(import.meta.url.replace(/^file\:/, ''))
)

const time = Date.now()

const postFileName = join(
 rootDirectory,
 'public',
 'content',
 `${time}.js`
)

const contents = `globalThis.content = globalThis.content ?? {}
globalThis.content[${time}] = {
 published: false,
 tags: [],
 time: ${time},
 title: 'New post',
 content: \`

 # Heading One

 **bold text** 
 
 *italicized text*
 
 - First list item
 - Second list item
 
 [This links to GitHub](https://github.com)

\`,
}

globalThis.registerContent?.(${time})
`

await writeFile(postFileName, contents, {
 encoding: 'utf-8',
 flag: 'ax',
})

console.log(`Created ${postFileName}`)
