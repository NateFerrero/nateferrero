// Create horizon element
const horizon = document.createElement('div')
horizon.classList.add('horizon')
document.body.appendChild(horizon)

// Create city cluster
const city = document.createElement('div')
city.classList.add('city')
city.style.left = Math.random() * 90 + 5 + 'vw'
horizon.appendChild(city)

// Create buildings
for (let i = 0; i < 20; i++) {
 const building = document.createElement('div')
 building.classList.add('building')
 randomScale(building)
 building.style.left = Math.random() * 100 + '%'
 city.appendChild(building)
}

// Create houses
for (let i = 0; i < 20; i++) {
 const house = document.createElement('div')
 house.classList.add('house')
 randomScale(house)
 house.style.left = Math.random() * 100 + 'vw'
 horizon.appendChild(house)
}

// Create trees
for (let i = 0; i < 120; i++) {
 const tree = document.createElement('div')
 tree.classList.add('tree')
 randomScale(tree)
 tree.style.left = Math.random() * 100 + 'vw'
 horizon.appendChild(tree)
}

function randomScale(element) {
 element.style.transform = `scale(${
  0.3 + 0.7 * Math.random()
 })`
}
