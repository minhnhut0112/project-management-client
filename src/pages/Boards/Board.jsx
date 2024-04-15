import { fetchBoardDetailsAPI } from '@/apis/boards.api'
import { generatePlaceholderCard } from '@/utils/formatters'
import { mapOrder } from '@/utils/sorts'
import { Box, LinearProgress } from '@mui/material'
import Container from '@mui/material/Container'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import BasicBars from './DashBoard/DashBoard'
import BasicTable from './Table/Table'

const socket = io('http://localhost:8017')

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

  const queryClient = useQueryClient()

  useEffect(() => {
    socket.on('createdCard', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('updatedCard', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('deletedCard', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('updatedCover', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('deletedCover', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('updateDates', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('deletedDate', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('uploadedAttachments', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('deletedAttachment', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('createdChecklist', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('updatedCheckList', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('createdComment', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('moveCardToDifferentColunmn', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('updateColumnOrderIds', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('editLabel', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('createNewLabel', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('deleteLabel', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('changeToAdmin', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('changeToMember', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('removeFromBoard', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('createNewColumn', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('updateCardOrderIds', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    socket.on('deleteColumn', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })
  }, [queryClient])

  const [index, setIndex] = useState(0)

  const boardDisPlay = (value) => {
    setIndex(value)
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: (theme) => `calc(100vh - ${theme.todolist.appBarHeight}`
      }}
    >
      {board ? (
        <Box
          sx={{
            backgroundImage: `url(${board?.cover})`,
            width: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <BoardBar board={board} boardDisPlay={boardDisPlay} index={index} />
          {index === 0 && <BoardContent board={board} boardId={board._id} />}
          {index === 1 && (
            <Box
              sx={{
                // backgroundImage: `url(${board?.cover})`,
                width: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Box sx={{ p: 2, width: '100%', height: (theme) => theme.todolist.boardContentHeight }}>
                <BasicTable board={board} />
              </Box>
            </Box>
          )}
          {index === 2 && (
            <Box
              sx={{
                // backgroundImage: `url(${board?.cover})`,
                width: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Box sx={{ p: 2, width: '100%', height: (theme) => theme.todolist.boardContentHeight }}>
                <BasicBars board={board} />
              </Box>
            </Box>
          )}
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

export default Board
