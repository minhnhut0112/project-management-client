import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) =>
          `calc(100vh - ${theme.todolist.appBarHeight} - ${theme.todolist.boardBarHeight})`
      }}
    >
      contenet
    </Box>
  )
}

export default BoardContent
