type Colors = {
  [key: string]: string | Record<string, string>
}

const colorSet = {
  blue: '#0064FF',
  orange: '#ff5b1a',
  white: '#ffffff',
  black: '#000000',
  lightblue: '#d7dfe9',
  lightGray: '#f2f2f2',
  darkgray: '#343434',
  beige: '#f5f5f5',
  yellow: '#eebc06',
  badge: {
    primary: '#0066cc',
    default: '#33ccff',
    minor: '#cccccc',
  },
}

function convertColorsToCSSVariables(
  colors: Colors,
  prefix = '--color',
): Record<string, string> {
  const cssVariables: Record<string, string> = {}

  function processColorObject(
    colorObject: Colors,
    currentPrefix: string[] = [],
  ) {
    Object.entries(colorObject).forEach(([key, value]) => {
      const variableName = [...currentPrefix, key].join('-')

      if (typeof value === 'string') {
        cssVariables[`${prefix}-${variableName}`] = value
      } else if (typeof value === 'object') {
        processColorObject(value, [...currentPrefix, key])
      }
    })
  }

  processColorObject(colors)

  return cssVariables
}

export const colorVariables = convertColorsToCSSVariables(colorSet)
