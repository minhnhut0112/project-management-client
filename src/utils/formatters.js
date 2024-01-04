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
