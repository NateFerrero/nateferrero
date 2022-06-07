function space(canvas) {
 const spaceCanvas = canvas ?? document.createElement('canvas')
 const { innerWidth: width, innerHeight: height } = window
 Object.assign(spaceCanvas.style, {
  backgroundColor: 'transparent',
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  opacity: 0.5
 })
 document.body.appendChild(spaceCanvas)
 return { canvas: spaceCanvas, context: spaceCanvas.getContext('2d') }
}

window.spaceLayer = space()

function stars() {
 const { innerWidth: width, innerHeight: height } = window
 Object.assign(window.spaceLayer.canvas, { width, height })
 window.spaceLayer.context.fillStyle = '#f9f9e008'
 window.spaceLayer.context.clearRect(0, 0, width, height)
 for (const id in new Array(1e5).fill()) {
  const size = (( id * id ) % 4 ) + 1
  const x = (12309814230987 * id) % width - size
  const y = 12309814230987 * id % height - size
  window.spaceLayer.context.fillRect(x, y, size * 2, size * 2)
 }
}

stars()
window.addEventListener('resize', stars)

