import {
  getStarredBoard,
  getUserAPI,
  removeStarredBoardAPI,
  updateRecentBoardAPI,
  updateStarredBoardAPI
} from '@/apis/users.api'
import { loginUser } from '@/redux/userSile'
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarRateIcon from '@mui/icons-material/StarRate'
import { Box, Checkbox, Grid, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const StarredBoard = () => {
  const user = useSelector((state) => state.user.auth)
  const userId = user?._id

  const [starredBoards, setStarredBoards] = useState([])
  const [starredIds, setStarredIds] = useState([])

  useEffect(() => {
    setStarredIds(user?.starredIds)
  }, [user])

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

  const mutionUpdateRecentBoard = useMutation({
    mutationFn: (data) => updateRecentBoardAPI(user._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardRecent'] })
    }
  })

  const navigate = useNavigate()

  const handleNavigateBoard = (event, boardId) => {
    if (!event.target.closest('input[type="checkbox"]')) {
      mutionUpdateRecentBoard.mutate({ boardId: boardId })
      navigate(`/board/${boardId}`)
    }
  }

  const disPatch = useDispatch()

  const handleGetDetailsUser = async (id, accessToken) => {
    const res = await getUserAPI(id)
    disPatch(loginUser({ ...res, accessToken: accessToken }))
  }

  const queryClient = useQueryClient()

  const mutionUpdateStarredBoard = useMutation({
    mutationFn: (data) => updateStarredBoardAPI(user._id, data),
    onSuccess: (data) => {
      setStarredIds(data.starredIds)
      const accessToken = user?.accessToken || localStorage.getItem('accessToken')
      handleGetDetailsUser(user._id, accessToken)
      queryClient.invalidateQueries({ queryKey: ['boardStarred'] })
    }
  })

  const mutionRemoveStarredBoard = useMutation({
    mutationFn: (data) => removeStarredBoardAPI(user._id, data),
    onSuccess: (data) => {
      setStarredIds(data.starredIds)
      const accessToken = user?.accessToken || localStorage.getItem('accessToken')
      handleGetDetailsUser(user._id, accessToken)
      queryClient.invalidateQueries({ queryKey: ['boardStarred'] })
    }
  })

  const updateStarredBoard = (boardId) => {
    if (starredIds?.includes(boardId)) {
      mutionRemoveStarredBoard.mutate({ boardId: boardId })
    } else {
      mutionUpdateStarredBoard.mutate({ boardId: boardId })
    }
  }

  return (
    <>
      {!!starredBoards?.length && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarBorderPurple500OutlinedIcon />
          <Typography variant='h6'>Starred boards</Typography>
        </Box>
      )}

      {!!starredBoards?.length && (
        <Grid container sx={{ gap: 2, mt: 1, mb: 2 }}>
          {starredBoards.map((board) => (
            <Grid
              key={board._id}
              sx={{
                backgroundImage: `url(${board?.cover})`,
                height: 100,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                cursor: 'pointer',
                borderRadius: '2px'
              }}
              item
              xs={6}
              md={2.5}
              onClick={(e) => handleNavigateBoard(e, board._id)}
            >
              <Typography
                sx={{
                  padding: 2,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  textShadow: '2px 2px 5px black'
                }}
              >
                {board.title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Checkbox
                  sx={{ color: 'white' }}
                  icon={<StarBorderIcon />}
                  checked={starredIds?.includes(board._id)}
                  onChange={() => updateStarredBoard(board?._id)}
                  checkedIcon={<StarRateIcon sx={{ color: '#f9ca24' }} />}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}

export default StarredBoard
