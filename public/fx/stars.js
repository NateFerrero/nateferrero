function space(canvas) {
 const spaceCanvas = canvas ?? document.createElement('canvas')
 const { innerWidth: width, innerHeight: height } = window
 Object.assign(spaceCanvas, { width, height })
 Object.assign(spaceCanvas.style, {
  backgroundColor: 'transparent',
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
 })
 document.body.appendChild(spaceCanvas)
 return spaceCanvas.getContext('2d')
}

window.spaceLayer = space()

function stars() {
 const { innerWidth: width, innerHeight: height } = window
 window.spaceLayer.fillStyle = '#f9f9e024'

 for (const id in new Array(3e2).fill()) {
  const size = (( id * id ) % 16 ) / 8 + 1
  // 12309814230987
  const x = (7654321 * id + 3456789 * id * id) % width - size
  const y = 2468 * id % height - size
  window.spaceLayer.fillRect(x, y, size * 2, size * 2)
 }
}

stars()

