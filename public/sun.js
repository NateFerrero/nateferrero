// Create sun element
const sun = document.createElement('div')
sun.classList.add('sun')
document.body.appendChild(sun)

const sunShade = document.createElement('div')
sunShade.classList.add('sun-shade')
sun.appendChild(sunShade)

const sunVerticalPosition = Math.random()

sunShade.style.backgroundColor = interpolateGradientColor(
 sunVerticalPosition
)

// Position sun randomly
sun.style.top = sunVerticalPosition * 100 + 'vh'
sun.style.left = Math.random() * 100 + 'vw'

// Thank you https://chat.openai.com
function interpolateGradientColor(value) {
 const colors = ['#ffff00', '#b9a497']

 if (value <= 0) return colors[0]
 if (value >= 1) return colors[colors.length - 1]

 const segment = 1 / (colors.length - 1)
 const segmentIndex = Math.floor(value / segment)
 const segmentStart = colors[segmentIndex]
 const segmentEnd = colors[segmentIndex + 1]

 const colorValue =
  (value - segmentIndex * segment) / segment

 // Parse colors into RGB values
 const parseColor = (color) => {
  const hex = color.substring(1) // Remove #
  return [
   parseInt(hex.substring(0, 2), 16), // Red value
   parseInt(hex.substring(2, 4), 16), // Green value
   parseInt(hex.substring(4, 6), 16), // Blue value
  ]
 }

 const startColor = parseColor(segmentStart)
 const endColor = parseColor(segmentEnd)

 // Interpolate RGB values
 const interpolatedColor = startColor.map(
  (channel, index) => {
   const delta = endColor[index] - channel
   return Math.round(channel + colorValue * delta)
  }
 )

 // Convert RGB values back to hex color
 const rgbToHex = (r, g, b) =>
  `#${((r << 16) | (g << 8) | b)
   .toString(16)
   .padStart(6, '0')}`

 return rgbToHex(
  interpolatedColor[0],
  interpolatedColor[1],
  interpolatedColor[2]
 )
}
