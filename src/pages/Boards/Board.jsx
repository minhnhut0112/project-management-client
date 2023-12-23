import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '@/apis'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formatters'
// import { mockData } from '@/apis/mock-data'
import { mapOrder } from '@/utils/sorts'
import { Box, LinearProgress } from '@mui/material'
import { useParams } from 'react-router-dom'

const Board = () => {
  const [board, setBoard] = useState(null)
  const { id } = useParams()

  const boardQuery = useQuery({ queryKey: ['board', id], queryFn: () => fetchBoardDetailsAPI(id) })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data

      boardData.columns = mapOrder(boardData.columns, boardData.columnOrderIds, '_id')

      boardData.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(boardData)
    }
  }, [boardQuery.data])

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: (theme) => `calc(100vh - ${theme.todolist.appBarHeight}`
      }}
    >
      <BoardBar board={board} />
      {board ? (
        <BoardContent board={board} boardId={board._id} />
      ) : (
        <Box
          sx={{
            height: (theme) => theme.todolist.boardContentHeight,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
          }}
        >
          <LinearProgress />
        </Box>
      )}
    </Container>
  )
}

export default Board
