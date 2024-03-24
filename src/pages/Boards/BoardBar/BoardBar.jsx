import { updateBoardAPI } from '@/apis/boards.api'
import { capitalizeFirstLetter } from '@/utils/formatters'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PublicIcon from '@mui/icons-material/Public'
import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import BoardUser from './BoardUser/BoardUser'
import InviteButon from './InviteButon/InviteButon'

const menuStyle = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px'
}

const BoardBar = ({ board }) => {
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
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
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#576574' : '#dfe6e9')
        // backdropFilter: 'blur(20px)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                width: `${chipWidth}px`,
                '& label': {
                  color: 'text.primary'
                },

                '& label.Mui-focused': {
                  color: (theme) => theme.palette.primary.main
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                },
                '& .MuiOutlinedInput-input': {
                  borderRadius: 1
                }
              }}
            />
          </Box>
        ) : (
          <Chip
            id='boardChip'
            sx={menuStyle}
            label={newBoardTitle}
            clickable
            icon={<DashboardIcon fontSize='small' />}
            onClick={() => setOpenNewBoardTitleForm(true)}
          />
        )}
        <Chip sx={menuStyle} label={capitalizeFirstLetter(board?.type)} clickable icon={<PublicIcon />} />
        <Chip sx={menuStyle} label='Add to Drive' clickable icon={<AddToDriveIcon />} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <BoardUser board={board} />

        <InviteButon board={board} />

        <IconButton onClick={handleDrawer}>
          <MoreHorizIcon />
        </IconButton>

        <Drawer anchor='right' open={isDrawerOpen} onClose={handleDrawer}>
          <div style={{ width: 250, padding: '20px' }}>
            <h2>Drawer Content</h2>
          </div>
        </Drawer>
      </Box>
    </Box>
  )
}

export default BoardBar
