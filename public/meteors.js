// Meteor container
const meteorContainer = document.createElement('div')
meteorContainer.classList.add('meteors')
Object.assign(meteorContainer.style, {
 position: 'fixed',
 left: 0,
 top: 0,
 width: '100vw',
 height: '100vh',
 overflow: 'hidden',
 pointerEvents: 'none',
})

document.body.appendChild(meteorContainer)

// Create meteor
function createMeteor() {
 const meteor = document.createElement('div')

 // % Values for positions
 const vw = 100
 const vh = 100

 // Pixels for calculations
 const w = window.innerWidth
 const h = window.innerHeight

 // Start position off screen top
 const startX = Math.random() * vw
 const startY = -20

 // End position off screen bottom
 const endX = Math.random() * vw
 const endY = 120

 // Transform calculation
 const xDiff = endX * w - startX * w
 const yDiff = endY * h - startY * h

 const angle = (Math.atan2(yDiff, xDiff) * 180) / Math.PI
 const randScale = Math.random() * 2

 // Set start styles
 Object.assign(meteor.style, {
  left: `${startX}vw`,
  top: `${startY}vh`,

  // Rotate and scale variety
  transform: `rotate(${angle}deg) scale(${randScale})`,
 })

 // Add meteor
 meteorContainer.appendChild(meteor)

 // Animate
 setTimeout(() => {
  Object.assign(meteor.style, {
   left: `${endX}vw`,
   top: `${endY}vh`,
   opacity: '0',
  })
 }, 5)

 // Remove
 setTimeout(() => meteor.remove(), 5e3)

 // Spawn another meteor
 setTimeout(createMeteor, Math.random() * 2e4)
}

// Spawn meteors
createMeteor()
