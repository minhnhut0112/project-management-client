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
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8017')

const Board = () => {
  const [board, setBoard] = useState(null)
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
          <BoardContent board={board} boardId={board._id} />
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
