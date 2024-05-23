import { ReactComponent as LogoApp } from '@/assets/trello.svg'
import AppsIcon from '@mui/icons-material/Apps'
import { SvgIcon, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'

import TextField from '@mui/material/TextField'

import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Create from './Menu/Create'
import Profile from './Menu/Profile'
import Notification from './Notifications'
import SearchPopover from './SearchPopover/SearchPopover'

const AppBar = () => {
  const [searchValue, setSearchValue] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.todolist.appBarHeight,
        paddingX: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#fff')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon
            component={LogoApp}
            fontSize='small'
            inheritViewBox
            sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
          />
          <Typography
            onClick={() => navigate('/')}
            variant='span'
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
              cursor: 'pointer'
            }}
          >
            TaskCraft
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {/* <WorkSpaces /> */}
          <Recent />
          <Starred />
          <Create />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          onClick={handleClick}
          placeholder='Search...'
          type='search'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }} />
              </InputAdornment>
            ),
            readOnly: true
          }}
          sx={{
            minWidth: 120,
            maxWidth: 180,
            mt: 0.5,
            '& label': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            },
            '& input': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            },
            '& label.Mui-focused': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') },
              '&:hover fieldset': { borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') },
              '&.Mui-focused fieldset': { borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }
            }
          }}
        />

        <SearchPopover open={open} anchorEl={anchorEl} handleClose={handleClose} />

        <Notification />

        <Box>
          <Profile />
        </Box>
      </Box>
    </Box>
  )
}

export default AppBar
