import { fetchBoardDetailsAPI } from '@/apis/boards.api'
import { generatePlaceholderCard } from '@/utils/formatters'
import { mapOrder } from '@/utils/sorts'
import { Box, Container, LinearProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BoardBar from '../Boards/BoardBar/BoardBar'
import BasicTable from './GrantChart/Table'

const TimeLine = () => {
  const [board, setBoard] = useState([])
  const [isLoadBoard, setIsLoadBoard] = useState(true)
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
      setIsLoadBoard(false)
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
      {board && !isLoadBoard ? (
        <Box
          sx={{
            backgroundImage: `url(${board?.cover})`,
            width: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <BoardBar board={board} />
          <Box sx={{ p: 2, width: '100%', height: (theme) => theme.todolist.boardContentHeight }}>
            <BasicTable board={board} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: (theme) => theme.todolist.boardContentHeight
          }}
        >
          <LinearProgress />
        </Box>
      )}
    </Container>
  )
}

export default TimeLine
