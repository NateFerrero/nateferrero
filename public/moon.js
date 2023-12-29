// Create moon element
const moon = document.createElement('div')
moon.classList.add('moon')
document.body.appendChild(moon)

const moonShade = document.createElement('div')
moonShade.classList.add('moon-shade')
moon.appendChild(moonShade)

const moonVerticalPosition = Math.random()

moonShade.style.backgroundColor = interpolateGradientColor(
 moonVerticalPosition
)

// Position moon randomly
moon.style.top = moonVerticalPosition * 100 + 'vh'
moon.style.left = Math.random() * 100 + 'vw'

// Thank you https://chat.openai.com
function interpolateGradientColor(value) {
 const colors = [
  '#002f4b',
  '#034672',
  '#07528c',
  '#335d8d',
  '#597090',
  '#7f838f',
  '#b9a497',
 ]

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
