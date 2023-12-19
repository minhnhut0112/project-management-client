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

const Board = () => {
  const [board, setBoard] = useState([])
  const id = '65819c55f7123f3745874e95'

  const boardQuery = useQuery({ queryKey: ['board', id], queryFn: () => fetchBoardDetailsAPI(id) })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data
      boardData.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      setBoard(boardData)
    }
  }, [boardQuery.data])

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: (theme) => `calc(100vh - ${theme.todolist.appBarHeight}` }}
    >
      <BoardBar board={board} />
      <BoardContent board={board} boardId={board._id} />
    </Container>
  )
}

export default Board
