// Capitalize the first letter of a string
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

export const getFileExtension = (filename) => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

export const isColorLight = (color) => {
  const hexColor = color?.substring(1) // Remove the '#' from the color
  const r = parseInt(hexColor?.slice(0, 2), 16)
  const g = parseInt(hexColor?.slice(2, 4), 16)
  const b = parseInt(hexColor?.slice(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 // Adjust this threshold as needed
}
