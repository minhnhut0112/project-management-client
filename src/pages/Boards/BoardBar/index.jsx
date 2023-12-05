import Box from '@mui/material/Box'

const BoardBar = () => {
  return (
    <Box
      sx={{
        height: (theme) => theme.todolist.boardBarHeight,
        width: '100%',
        backgroundColor: 'primary.dark'
      }}
    >
      Board Bar
    </Box>
  )
}

export default BoardBar
