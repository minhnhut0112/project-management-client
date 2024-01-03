import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import PublicIcon from '@mui/icons-material/Public'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { TextField, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { capitalizeFirstLetter } from '@/utils/formatters'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveColumnAPI } from '@/apis/boards.api'
import { toast } from 'react-toastify'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

const menuStyle = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px'
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
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
    if (board) {
      setNewBoardTitle(board.title)
    }
  }, [board])

  const queryClient = useQueryClient()

  const mutionEditBoardTitle = useMutation({
    mutationFn: (data) => moveColumnAPI(board._id, data)
  })

  const editBoardTitle = () => {
    if (newBoardTitle.trim() === board.title || !newBoardTitle) {
      setOpenNewBoardTitleForm(false)
      setNewBoardTitle(board.title)
      return
    }

    mutionEditBoardTitle.mutate(
      {
        title: newBoardTitle
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['board'] })
          toast.success('Edit Board Title is successfully!')
        }
      }
    )
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
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',

              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          <Tooltip title='minhnhut'>
            <Avatar sx={{ backgroundColor: getRandomColor() }} alt='minhnhut' src=''>
              N
            </Avatar>
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar sx={{ backgroundColor: getRandomColor() }} alt='datmap'>
              D
            </Avatar>
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar alt='minhnhut' />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
        </AvatarGroup>
        <Button
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            '&:hover': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            }
          }}
          variant='outlined'
          startIcon={<PersonAddAltOutlinedIcon />}
        >
          Invite
        </Button>
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
