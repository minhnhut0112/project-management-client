import { getRecentBoard } from '@/apis/users.api'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Avatar, Popover } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Recent = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const user = useSelector((state) => state.user.auth)
  const userId = user?._id

  const [recentBoards, setRecentBoards] = useState([])

  const boardQuery = useQuery({
    queryKey: ['boardRecent', userId],
    queryFn: async () => {
      if (!userId) return []
      return await getRecentBoard(userId)
    }
  })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data
      setRecentBoards(boardData)
    }
  }, [boardQuery.data])

  const navigate = useNavigate()

  const handleNavigate = (boardId) => {
    navigate(`/board/${boardId}`)
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
        id='basic-button-recent'
        aria-controls={open ? 'basic-menu-recent' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Recent
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ width: 250, p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {recentBoards?.slice(0, 5)?.map((board) => (
            <Box
              key={board._id}
              onClick={() => handleNavigate(board._id)}
              sx={{
                display: 'flex',
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#f5f5f5'
                },
                p: 0.5
              }}
            >
              <Avatar src={board?.cover} sx={{ width: 50, height: 40 }} variant='rounded' />
              <Typography variant='body' sx={{ mt: 0.25, fontSize: '16px', fontWeight: 500 }}>
                {board?.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  )
}

export default Recent
