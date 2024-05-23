import { createBoardAPI } from '@/apis/boards.api'
import { ReactComponent as boardbg } from '@/assets/trello.board.bg.svg'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined'
import { Box, Popover, SvgIcon, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
  },
  {
    img: 'http://localhost:8017/uploads/bg9.jpg',
    title: 'bg9'
  }
]

const Create = () => {
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState(itemData[0].img)

  const user = useSelector((state) => state.user.auth)

  const [anchorEl, setAnchorEl] = useState(null)

  const [newBoardTitle, setNewBoardTitle] = useState('')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

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
      navigate(`/board/${data?._id}`)
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    }
  })

  const createNewBoard = () => {
    if (!newBoardTitle || !imageSrc || !user) {
      handleClose()
      return
    }

    if (newBoardTitle.length < 5) {
      toast.error('Board title needs at least 3 characters')
      return
    }

    mutionCreateBoard.mutate({ title: newBoardTitle, cover: imageSrc, ownerId: user._id })
    handleClose()
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        onTouchStart={handleClick}
        sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
        startIcon={<LibraryAddOutlinedIcon />}
      >
        Create
      </Button>

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
    </div>
  )
}

export default Create
