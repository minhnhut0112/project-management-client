import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '@/apis'
import { useQuery } from '@tanstack/react-query'
// import { mockData } from '@/apis/mock-data'

const Board = () => {
  const id = '657feca507a8c7d20ab58227'

  const { data: board } = useQuery({ queryKey: ['board', id], queryFn: () => fetchBoardDetailsAPI(id) })

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: (theme) => `calc(100vh - ${theme.todolist.appBarHeight}` }}
    >
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
