// Create star container
const starContainer = document.createElement('div')

// Set styles
Object.assign(starContainer.style, {
 position: 'fixed',
 top: 0,
 left: 0,
 width: '100vw',
 height: '100vh',
})

// Add to DOM
document.body.appendChild(starContainer)

// Create a star
function createStar() {
 const star = document.createElement('div')
 star.classList.add('star')

 // Random position and size
 const randX = Math.random() * 100
 const randY = Math.random() * 100
 const randScale = Math.random() * 2

 // Set styles
 Object.assign(star.style, {
  left: `${randX}vw`,
  top: `${randY}vh`,
  transform: `scale(${randScale})`, // Size variety
 })

 starContainer.appendChild(star)
}

// Add 150 stars
for (let i = 0; i < 150; i++) {
 createStar()
}
