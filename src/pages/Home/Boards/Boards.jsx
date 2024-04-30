import { Box, Checkbox, Grid, Popover, SvgIcon, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarRateIcon from '@mui/icons-material/StarRate'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBoardAPI, fetchAllBoardsAPI } from '@/apis/boards.api'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { ReactComponent as boardbg } from '@/assets/trello.board.bg.svg'
import IconButton from '@mui/material/IconButton'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAPI, removeStarredBoardAPI, updateRecentBoardAPI, updateStarredBoardAPI } from '@/apis/users.api'
import { loginUser } from '@/redux/userSile'

const itemData = [
  {
    img: 'http://localhost:8017/uploads/bg1.jpg',
    title: 'bg1'
  },
  {
    img: 'http://localhost:8017/uploads/bg2.jpg',
    title: 'bg2'
  },
  {
    img: 'http://localhost:8017/uploads/bg3.jpg',
    title: 'bg3'
  },
  {
    img: 'http://localhost:8017/uploads/bg4.jpg',
    title: 'bg4'
  },
  {
    img: 'http://localhost:8017/uploads/bg5.jpg',
    title: 'bg5'
  },
  {
    img: 'http://localhost:8017/uploads/bg6.jpg',
    title: 'bg6'
  },
  {
    img: 'http://localhost:8017/uploads/bg7.jpg',
    title: 'bg7'
  },
  {
    img: 'http://localhost:8017/uploads/bg8.jpg',
    title: 'bg8'
  }
]

const Boards = () => {
  const navigate = useNavigate()
  const [boards, setBoards] = useState(null)
  const [imageSrc, setImageSrc] = useState(itemData[0].img)
  const [starredIds, setStarredIds] = useState([])

  const user = useSelector((state) => state.user.auth)

  useEffect(() => {
    setStarredIds(user?.starredIds)
  }, [user])

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/sign-in')
  //   }
  // }, [navigate, user])

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

  const yourBoards = boards?.filter((board) => board.ownerId === user?._id)

  const guestBoards = boards?.filter((board) => board.ownerId !== user?._id)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const [newBoardTitle, setNewBoardTitle] = useState('')

  const handleClose = () => {
    setAnchorEl(null)
    setNewBoardTitle('')
    setImageSrc(itemData[0].img)
    document.body.focus()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const queryClient = useQueryClient()

  const mutionCreateBoard = useMutation({
    mutationFn: (data) => createBoardAPI(data),
    onSuccess: (data) => {
      mutionUpdateRecentBoard.mutate({ boardId: data?._id })
      navigate(`/board/${data?._id}`)
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    }
  })

  const createNewBoard = () => {
    if (!newBoardTitle || !imageSrc || !user) {
      handleClose()
      return
    }
    mutionCreateBoard.mutate({ title: newBoardTitle, cover: imageSrc, ownerId: user._id })
    handleClose()
  }

  const mutionUpdateRecentBoard = useMutation({
    mutationFn: (data) => updateRecentBoardAPI(user._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardRecent'] })
    }
  })

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
    <Box sx={{ width: { xs: 250, md: 1200 } }}>
      <Typography variant='h6'>Your Boards</Typography>

      <Grid container sx={{ gap: 2, mt: 1, mb: 3 }}>
        {yourBoards?.map((board) => (
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
                onChange={() => updateStarredBoard(board?._id)}
                sx={{ color: 'white' }}
                icon={<StarBorderIcon />}
                checked={starredIds?.includes(board._id)}
                checkedIcon={<StarRateIcon sx={{ color: '#f9ca24' }} />}
              />
            </Box>
          </Grid>
        ))}

        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#091e420f'),
            height: 100,
            borderRadius: '2px'
          }}
          item
          xs={6}
          md={2.5}
        >
          <Button
            aria-describedby={id}
            onClick={handleClick}
            onTouchStart={handleClick}
            sx={{
              color: (theme) => (theme.palette.mode === 'dark' ? '#ffffff' : '#172B4D'),
              width: '100%',
              '&:focus': { display: 'none' }
            }}
          >
            Create new board
          </Button>
          <Box>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              sx={{ mx: 2 }}
            >
              <Box
                as='form'
                onSubmit={(e) => {
                  e.preventDefault()
                  createNewBoard()
                }}
                sx={{ width: 300, p: 2, height: 'fit-content' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ marginLeft: '35px' }}></Box>
                  <Typography sx={{ fontSize: '18px' }} variant='h6'>
                    Create new board
                  </Typography>
                  <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
                    <ClearOutlinedIcon fontSize='small' />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%'
                  }}
                >
                  <SvgIcon
                    component={boardbg}
                    fontSize='small'
                    inheritViewBox
                    sx={{
                      color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
                      width: '100%',
                      height: '100%',
                      p: 1
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '16px', m: '5px 0 5px 0' }} variant='h6'>
                  Choose background
                </Typography>
                <ImageList sx={{ width: '100%', mt: '5px', mb: '5px' }} cols={3} rowHeight={60}>
                  {itemData.map((item) => (
                    <ImageListItem key={item.img}>
                      <img
                        srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        onClick={() => setImageSrc(item?.img)}
                        src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.title}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
                <TextField
                  autoFocus
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  sx={{ width: '100%', mt: 2 }}
                  label='Enter board title'
                  size='small'
                ></TextField>
                <Box sx={{ width: '100%' }}>
                  <Button
                    disabled={!imageSrc || !newBoardTitle}
                    sx={{ width: '100%', mt: 2 }}
                    type='submit'
                    variant='outlined'
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </Popover>
          </Box>
        </Grid>
      </Grid>

      {!!guestBoards?.length && (
        <Box>
          <Typography variant='h6'>Guest Boards</Typography>
          <Grid container sx={{ gap: 2, mt: 1 }}>
            {guestBoards?.map((board) => (
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
        </Box>
      )}
    </Box>
  )
}

export default Boards
