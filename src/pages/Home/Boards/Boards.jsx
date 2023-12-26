import { Box, Checkbox, Grid, Popover, TextField, Typography } from '@mui/material'
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
import { toast } from 'react-toastify'

const Boards = () => {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [boards, setBoards] = useState(null)

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
    document.body.focus()
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleChange = (event) => {
    setVisibility(event.target.value)
  }

  const queryClient = useQueryClient()

  const mutionCreateBoard = useMutation({
    mutationFn: (data) => createBoardAPI(data)
  })

  const createNewBoard = () => {
    if (!newBoardTitle) {
      handleClose()
      toast.error('Please Enter Board Title!')
      return
    }
    mutionCreateBoard.mutate(
      { title: newBoardTitle, type: visibility },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['boards'] })
          toast.success('Create board is successfully!')
        }
      }
    )
    handleClose()
  }

  return (
    <Box sx={{ padding: '10px 0px 10px 0px', width: { xs: 250, md: 1000 }, mx: 3 }}>
      <Typography variant='h6' sx={{ color: 'white' }}>
        YOUR WORKSPACES
      </Typography>

      <Grid container sx={{ gap: 2 }}>
        {boards?.map((board) => (
          <>
            <Grid
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                height: 100,
                cursor: 'pointer',
                mt: 3,
                borderRadius: '3px'
              }}
              item
              xs={6}
              md={3}
              onClick={(event) => !event.target.closest('input[type="checkbox"]') && navigate(`/board/${board._id}`)}
            >
              <Typography sx={{ padding: 2 }}>{board.title}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Checkbox
                  icon={<StarBorderIcon />}
                  checked={board?.starred}
                  onClick={handleCheckboxClick}
                  checkedIcon={<StarRateIcon sx={{ color: '#f9ca24' }} />}
                />
              </Box>
            </Grid>
          </>
        ))}
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            bgcolor: '#ffffff3d',
            mt: 3,
            height: 100
          }}
          item
          xs={6}
          md={3}
        >
          <Button
            aria-describedby={id}
            onClick={handleClick}
            onTouchStart={handleClick}
            sx={{ color: 'white', width: '100%', '&:focus': { display: 'none' } }}
          >
            Add new board
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
                sx={{ width: 300, height: 240, p: 2 }}
              >
                <Typography sx={{ textAlign: 'center' }} variant='h6'>
                  Create board
                </Typography>
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
                  <Button sx={{ width: '100%', mt: 2 }} type='submit' variant='outlined'>
                    Create Board
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
