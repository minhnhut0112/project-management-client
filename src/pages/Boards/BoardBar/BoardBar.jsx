import { updateBoardAPI } from '@/apis/boards.api'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarRateIcon from '@mui/icons-material/StarRate'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined'
import { Checkbox, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import BoardMenu from './BoardMenu/BoardMenu'
import BoardUser from './BoardUser/BoardUser'
import InviteButon from './InviteButon/InviteButon'

const menuStyle = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  color: 'white'
}

const BoardBar = ({ board, boardDisPlay, index }) => {
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
        background: '#0000003d'
        // bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#576574' : '#dfe6e9')
        // backdropFilter: 'blur(20px)'
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
          sx={{ ...menuStyle, bgcolor: index === 0 ? '#e9f2ff' : 'transparent', color: index !== 0 && 'white' }}
          label='Board'
          clickable
          icon={<ViewKanbanOutlinedIcon color='white' fontSize='small' />}
          onClick={() => boardDisPlay(0)}
        />

        <Chip
          sx={{ ...menuStyle, bgcolor: index === 1 ? '#e9f2ff' : 'transparent', color: index !== 1 && 'white' }}
          label='Table'
          clickable
          icon={<TableChartOutlinedIcon color='white' fontSize='small' />}
          onClick={() => boardDisPlay(1)}
        />

        <Chip
          sx={{ ...menuStyle, bgcolor: index === 2 ? '#e9f2ff' : 'transparent', color: index !== 2 && 'white' }}
          label='DashBoard'
          clickable
          icon={<InsertChartOutlinedOutlinedIcon color='white' fontSize='small' />}
          onClick={() => boardDisPlay(2)}
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
