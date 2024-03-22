import Container from '@mui/material/Container'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formatters'
import { mapOrder } from '@/utils/sorts'
import { Box, LinearProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { fetchBoardDetailsAPI } from '@/apis/boards.api'

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
      <Box
        sx={{
          backgroundImage: `url(${board?.cover})`,
          width: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <BoardBar board={board} />
        {board ? (
          <BoardContent board={board} boardId={board._id} />
        ) : (
          <Box
            sx={{
              height: (theme) => theme.todolist.boardContentHeight
            }}
          >
            <LinearProgress />
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default Board
