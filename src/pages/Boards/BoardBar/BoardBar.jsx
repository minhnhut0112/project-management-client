import { fetchBoardDetailsAPI, updateBoardAPI } from '@/apis/boards.api'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarRateIcon from '@mui/icons-material/StarRate'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import { Checkbox, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import BoardMenu from './BoardMenu/BoardMenu'
import BoardUser from './BoardUser/BoardUser'
import InviteButon from './InviteButon/InviteButon'
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { mapOrder } from '@/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formatters'
import { io } from 'socket.io-client'

const menuStyle = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  color: 'white'
}

const socket = io('http://localhost:8017')

const BoardBar = () => {
  const [board, setBoard] = useState(null)

  const location = useLocation()

  // Lấy path từ location
  const path = location.pathname
  // Tách chuỗi path để lấy phần trước issueId
  const parts = path.split('/')
  const displayType = parts[parts.length - 2]

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

  const [openNewBoardTitleForm, setOpenNewBoardTitleForm] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [chipWidth, setChipWidth] = useState(null)

  useEffect(() => {
    const chipElement = document.getElementById('boardChip')
    if (chipElement) {
      setChipWidth(chipElement.clientWidth)
    }
  }, [board?.title, openNewBoardTitleForm, newBoardTitle])

  useEffect(() => {
    if (board?.title) {
      setNewBoardTitle(board?.title)
    }
  }, [board?.title])

  const queryClient = useQueryClient()

  const mutionEditBoardTitle = useMutation({
    mutationFn: (data) => updateBoardAPI(board._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const editBoardTitle = () => {
    if (newBoardTitle.trim() === board.title || !newBoardTitle) {
      setOpenNewBoardTitleForm(false)
      setNewBoardTitle(board.title)
      return
    }

    mutionEditBoardTitle.mutate({
      title: newBoardTitle
    })

    setOpenNewBoardTitleForm(false)
  }

  const navigate = useNavigate()

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
    socket.on('updateIssue', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })
    socket.on('createNewIssue', () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })
  }, [queryClient])

  if (!board) return

  return (
    <Box
      sx={{
        height: (theme) => theme.todolist.boardBarHeight,
        width: '100%',
        paddingX: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        backdropFilter: blur(1),
        background: '#0000003d',
        // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#576574' : '#dfe6e9')
        // backdropFilter: 'blur(20px)',
        backgroundImage: `url(${board?.cover})`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {openNewBoardTitleForm ? (
          <Box
            as='form'
            onSubmit={(e) => {
              e.preventDefault()
              editBoardTitle()
            }}
          >
            <TextField
              type='text'
              value={newBoardTitle}
              onBlur={editBoardTitle}
              autoFocus
              data-no-dnd='true'
              onChange={(e) => setNewBoardTitle(e.target.value)}
              size='small'
              sx={{
                color: 'white',
                width: `${chipWidth}px`,
                '& label': {
                  color: 'white'
                },

                '& label.Mui-focused': {
                  bgcolor: 'white'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                },
                '& .MuiOutlinedInput-input': {
                  borderRadius: 1,
                  bgcolor: 'white'
                }
              }}
            />
          </Box>
        ) : (
          <Chip
            id='boardChip'
            sx={{ ...menuStyle, fontWeight: 'bold', fontSize: '18px' }}
            label={newBoardTitle}
            clickable
            icon={<DashboardIcon color='white' fontSize='small' />}
            onClick={() => setOpenNewBoardTitleForm(true)}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Checkbox
            icon={<StarBorderIcon sx={{ color: 'white' }} />}
            checkedIcon={<StarRateIcon sx={{ color: '#f9ca24' }} />}
          />
        </Box>

        <Chip
          sx={{
            ...menuStyle,
            bgcolor: displayType === 'board' ? '#e9f2ff' : 'transparent',
            color: displayType !== 'board' && 'white',
            '&:hover': { bgcolor: displayType === 'board' && '#e9f2ff' }
          }}
          label='Board'
          clickable
          icon={<ViewKanbanOutlinedIcon color='white' fontSize='small' />}
          onClick={() => navigate(`/board/${board._id}`)}
        />

        <Chip
          sx={{
            ...menuStyle,
            bgcolor: displayType === 'table' ? '#e9f2ff' : 'transparent',
            color: displayType !== 'table' && 'white',
            '&:hover': { bgcolor: displayType === 'table' && '#e9f2ff' }
          }}
          label='Table'
          clickable
          icon={<TableChartOutlinedIcon color='white' fontSize='small' />}
          onClick={() => navigate(`/table/${board._id}`)}
        />

        <Chip
          sx={{
            ...menuStyle,
            bgcolor: displayType === 'dashboard' ? '#e9f2ff' : 'transparent',
            color: displayType !== 'dashboard' && 'white',
            '&:hover': { bgcolor: displayType === 'dashboard' && '#e9f2ff' }
          }}
          label='DashBoard'
          clickable
          icon={<InsertChartOutlinedOutlinedIcon color='white' fontSize='small' />}
          onClick={() => navigate(`/dashboard/${board._id}`)}
        />

        <Chip
          sx={{
            ...menuStyle,
            bgcolor: displayType === 'issue' ? '#e9f2ff' : 'transparent',
            color: displayType !== 'issue' && 'white',
            '&:hover': { bgcolor: displayType === 'issue' && '#e9f2ff' }
          }}
          label='Issues'
          clickable
          icon={<AdjustOutlinedIcon color='white' fontSize='small' />}
          onClick={() => navigate(`/issue/${board._id}`)}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <Chip sx={menuStyle} label='Add to Drive' clickable icon={<AddToDriveIcon />} /> */}

        <span>|</span>

        <BoardUser board={board} />

        <InviteButon board={board} />

        <BoardMenu board={board} />
      </Box>
    </Box>
  )
}

export default BoardBar
