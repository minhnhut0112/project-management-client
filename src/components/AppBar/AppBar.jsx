import Box from '@mui/material/Box'
import ModeSelect from '@/components/ModeSelect/ModeSelect'
import { ReactComponent as LogoApp } from '@/assets/trello.svg'
import { SvgIcon, Typography } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'
import WorkSpaces from './Menu/WorkSpaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Button from '@mui/material/Button'
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import Profile from './Menu/Profile'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AppBar = () => {
  const [searchValue, setSearchValue] = useState('')
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
          <WorkSpaces />
          <Recent />
          <Starred />
          <Button
            sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
            startIcon={<LibraryAddOutlinedIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label='Search...'
          type='text'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }} />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                onClick={() => setSearchValue('')}
                fontSize='small'
                sx={{
                  color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
                  cursor: 'pointer',
                  display: !searchValue ? 'none' : 'block'
                }}
              />
            )
          }}
          sx={{
            minWidth: 120,
            maxWidth: 170,
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
        <ModeSelect />
        <Tooltip title='Notifications'>
          <Badge color='warning' variant='dot'>
            <NotificationsNoneOutlinedIcon
              sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
            />
          </Badge>
        </Tooltip>

        <Box>
          <Profile />
        </Box>
      </Box>
    </Box>
  )
}

export default AppBar
