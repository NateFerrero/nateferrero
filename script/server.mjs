import { readFile } from 'fs'
import { createServer } from 'http'
import { extname } from 'path'

function parseIntOrDefault(str, defaultValue) {
 const num = parseInt(str)

 if (isNaN(num)) {
  return defaultValue
 } else {
  return num
 }
}

const port = parseIntOrDefault(process.env.PORT, 4567)

createServer((req, res) => {
 readFile(
  `./public${req.url === '/' ? '/index.html' : req.url}`,
  (err, data) => {
   res.writeHead(err ? 404 : 200, {
    'Content-Type': err
     ? 'text/plain'
     : {
        '.css': 'text/css',
        '.js': 'text/javascript',
       }[extname(req.url)] ?? 'text/html',
   })
   res.end(err ? 'Not found' : data)
  }
 )
}).listen(port, () => {
 console.log(`Server listening on port ${port}`)
})
