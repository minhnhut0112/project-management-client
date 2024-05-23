import { fetchAllBoardsAPI } from '@/apis/boards.api'
import { getRecentBoard, getUserAPI, updateRecentBoardAPI } from '@/apis/users.api'
import { loginUser } from '@/redux/userSile'
import { Avatar, Box, TextField, Typography } from '@mui/material'
import Popover from '@mui/material/Popover'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SearchPopover = ({ anchorEl, handleClose, open }) => {
  const [boards, setBoards] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBoards, setFilteredBoards] = useState([])

  const user = useSelector((state) => state.user.auth)

  const boardsQuery = useQuery({
    queryKey: ['boards', user?._id],
    queryFn: async () => {
      if (!user?._id) return []
      return await fetchAllBoardsAPI(user?._id)
    }
  })

  useEffect(() => {
    if (boardsQuery.data) {
      setBoards(boardsQuery.data)
    }
  }, [boardsQuery.data])

  useEffect(() => {
    setFilteredBoards([])
  }, [open])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBoards([])
    } else {
      const filtered = boards.filter((board) => board.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredBoards(filtered)
    }
  }, [searchQuery, boards])

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
    navigate(`/board/${boardId}`)
    mutionUpdateRecentBoard.mutate({ boardId: boardId })
    handleClose()
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        handleClose()
        setSearchQuery('')
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      sx={{ boxShadow: 'none' }}
    >
      <Box sx={{ width: 700, minHeight: 300, p: 2 }}>
        <TextField
          autoFocus
          size='small'
          variant='outlined'
          placeholder='Search boards...'
          type='search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {filteredBoards?.length === 0 && searchQuery.length > 0 ? (
          <Typography variant='body2' color='textSecondary'>
            No boards found.
          </Typography>
        ) : (
          <Box>
            {filteredBoards?.length !== 0 && <Typography sx={{ ml: 0.5 }}>Boards</Typography>}
            {filteredBoards?.map((board) => (
              <Box
                key={board._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  },
                  p: 0.5,
                  cursor: 'pointer'
                }}
                onClick={() => handleNavigate(board?._id)}
              >
                <Avatar sx={{ width: 60, height: 40 }} src={board?.cover} variant='square' />
                <Typography sx={{ fontSize: '16px', fontWeight: 400 }} variant='body'>
                  {board?.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {filteredBoards?.length === 0 && searchQuery.length === 0 && (
          <Box>
            {recentBoards?.length !== 0 && <Typography sx={{ ml: 0.5 }}>Recent Board</Typography>}
            {recentBoards?.map((board) => (
              <Box
                key={board._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  },
                  p: 0.5,
                  cursor: 'pointer'
                }}
                onClick={() => handleNavigate(board?._id)}
              >
                <Avatar sx={{ width: 60, height: 40 }} src={board?.cover} variant='square' />
                <Typography sx={{ fontSize: '16px', fontWeight: 400 }} variant='body'>
                  {board?.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Popover>
  )
}

export default SearchPopover
