import { getStarredBoard, getUserAPI, updateRecentBoardAPI } from '@/apis/users.api'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Avatar, Popover, SvgIcon } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as noStarred } from '@/assets/nostarred.svg'
import { loginUser } from '@/redux/userSile'

const Starred = () => {
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

  const [starredBoards, setStarredBoards] = useState([])

  const boardQuery = useQuery({
    queryKey: ['boardStarred', userId],
    queryFn: async () => {
      if (!userId) return []
      return await getStarredBoard(userId)
    }
  })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data
      setStarredBoards(boardData)
    }
  }, [boardQuery.data])

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const handleGetDetailsUser = async (id, accessToken) => {
    const res = await getUserAPI(id)
    dispatchEvent(loginUser({ ...res, accessToken: accessToken }))
  }

  const mutionUpdateRecentBoard = useMutation({
    mutationFn: (data) => updateRecentBoardAPI(user._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardRecent'] })
      const accessToken = user?.accessToken || localStorage.getItem('accessToken')
      handleGetDetailsUser(user._id, accessToken)
    }
  })

  const handleNavigate = (boardId) => {
    mutionUpdateRecentBoard.mutate({ boardId: boardId })
    navigate(`/board/${boardId}`)
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
        id='basic-button-starred'
        aria-controls={open ? 'basic-menu-starred' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Starred
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
        <Box sx={{ minwidth: 250, p: 1 }}>
          <Typography variant='body' fontSize={18}>
            Starred boards
          </Typography>
          {!!starredBoards.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {starredBoards?.map((board) => (
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
          ) : (
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', width: 310 }}>
              <SvgIcon
                component={noStarred}
                fontSize='small'
                inheritViewBox
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
                  width: 300,
                  height: '100%',
                  p: 1
                }}
              />
              <Typography variant='body' sx={{ fontSize: '16px', textAlign: 'center' }}>
                Star important boards to access them quickly and easily.
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default Starred
