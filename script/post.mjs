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
 `${time}.mjs`
)

const contents = `export const published = false
export const tags = []
export const time = ${time}
export const title = 'New post'
export const snippet = ''
export const content = \`

# Heading One

**bold text**

*italicized text*

- First list item
- Second list item

[This links to GitHub](https://github.com)

\`
`

await writeFile(postFileName, contents, {
 encoding: 'utf-8',
 flag: 'ax',
})

console.log(`Created ${postFileName}`)
