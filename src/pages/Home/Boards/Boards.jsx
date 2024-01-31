import { Box, Checkbox, Grid, Popover, SvgIcon, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarRateIcon from '@mui/icons-material/StarRate'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBoardAPI, fetchAllBoardsAPI } from '@/apis/boards.api'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { ReactComponent as boardbg } from '@/assets/trello.board.bg.svg'
import IconButton from '@mui/material/IconButton'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'

const itemData = [
  {
    img: 'https://1.bp.blogspot.com/--8hF_fSPDWM/YTa5yJ5NxEI/AAAAAAAAHgI/FCKkttVZaBUeUN_fIJC1ny444vu4QRCxwCLcBGAsYHQ/s0-rw/hinh-nen-may-tinh-full-hd-cuc-dep-61.jpg',
    title: 'Coffee'
  },
  {
    img: 'https://1.bp.blogspot.com/-Lw-Jbz0M05c/YTa5ZHqdr-I/AAAAAAAAHaY/XivGTHyBt5UWtqMDjiAsx_DyKTZ1T-ZYQCLcBGAsYHQ/s0-rw/hinh-nen-may-tinh-full-hd-cuc-dep-4.jpg',
    title: 'Hats'
  },
  {
    img: 'https://1.bp.blogspot.com/-wHNc1eq9fpo/YTa4O0iiK3I/AAAAAAAAHJw/1kRgEYPGak8-bnCl8c0BqiNJUqrFCpg9ACLcBGAsYHQ/s0-rw/hinh-nen-may-tinh-full-hd-cuc-dep-16.jpg',
    title: 'Honey'
  },
  {
    img: 'https://1.bp.blogspot.com/-n4Krw0YS-Uk/YTa4fIbzUzI/AAAAAAAAHNM/83TOiGwJ4HIP-oh54_LtZNgDFLQi05jvwCLcBGAsYHQ/s0-rw/hinh-nen-may-tinh-full-hd-cuc-dep-21.jpg',
    title: 'Basketball'
  },
  {
    img: 'https://1.bp.blogspot.com/-3cWMJKowm6c/YTa41Q-SF1I/AAAAAAAAHSE/V6Ibuh23MHQoD961d5ahPPJfpKjqUYpZACLcBGAsYHQ/s0-rw/hinh-nen-may-tinh-full-hd-cuc-dep-28.jpg',
    title: 'Fern'
  },
  {
    img: 'https://1.bp.blogspot.com/-G1Z1e6rHNgc/YTa5r4yB3fI/AAAAAAAAHek/GoCreu5YihwjbBr3XGMMoqHkULSLYFpMgCLcBGAsYHQ/s0-rw/hinh-nen-may-tinh-full-hd-cuc-dep-46.jpg',
    title: 'Mushrooms'
  }
]

const Boards = () => {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [boards, setBoards] = useState(null)
  const [imageSrc, setImageSrc] = useState(itemData[0].img)

  const handleCheckboxClick = () => {
    setChecked(!checked)
  }

  const boardsQuery = useQuery({ queryKey: ['boards'], queryFn: () => fetchAllBoardsAPI() })

  useEffect(() => {
    if (boardsQuery.data) {
      setBoards(boardsQuery.data)
      setChecked(boardsQuery.data.starred)
    }
  }, [boardsQuery.data])

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const [newBoardTitle, setNewBoardTitle] = useState('')
  const [visibility, setVisibility] = useState('public')

  const handleClose = () => {
    setAnchorEl(null)
    setNewBoardTitle('')
    setVisibility('public')
    setImageSrc(itemData[0].img)
    document.body.focus()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleChange = (event) => {
    setVisibility(event.target.value)
  }

  const queryClient = useQueryClient()

  const mutionCreateBoard = useMutation({
    mutationFn: (data) => createBoardAPI(data),
    onSuccess: (data) => {
      navigate(`/board/${data?._id}`)
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    }
  })

  const createNewBoard = () => {
    if (!newBoardTitle || !imageSrc) {
      handleClose()
      return
    }
    mutionCreateBoard.mutate({ title: newBoardTitle, type: visibility, cover: imageSrc })
    handleClose()
  }

  return (
    <Box sx={{ padding: '10px 0px 10px 0px', width: { xs: 250, md: 1000 }, mx: 3 }}>
      <Typography variant='h6' sx={{ color: 'white' }}>
        YOUR WORKSPACES
      </Typography>

      <Grid container sx={{ gap: 2 }}>
        {boards?.map((board) => (
          <Grid
            key={board._id}
            sx={{
              backgroundImage: `url(${board?.cover})`,
              height: 100,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              cursor: 'pointer',
              mt: 3,
              borderRadius: '2px'
            }}
            item
            xs={6}
            md={2.5}
            onClick={(event) => !event.target.closest('input[type="checkbox"]') && navigate(`/board/${board._id}`)}
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
                checked={board?.starred}
                onClick={handleCheckboxClick}
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
            mt: 3,
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
                sx={{ width: 300, height: 565, p: 2 }}
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
                <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel defaultValue='Public' size='small' id='demo-simple-select-label'>
                      Visibility
                    </InputLabel>
                    <Select
                      size='small'
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={visibility}
                      label='Visibility'
                      onChange={handleChange}
                    >
                      <MenuItem value='public'>Public</MenuItem>
                      <MenuItem value='private'>Private</MenuItem>
                    </Select>
                  </FormControl>
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
    </Box>
  )
}

export default Boards
