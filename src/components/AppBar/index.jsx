import Box from '@mui/material/Box'
import ModeSelect from '@/components/ModeSelect'
import { ReactComponent as LogoApp } from '@/assets/trello.svg'
import { SvgIcon, Typography } from '@mui/material'
import AppsIcon from '@mui/icons-material/Apps'
import WorkSpaces from './Menu/WorkSpaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Button from '@mui/material/Button'
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import Profile from './Menu/Profile'

const AppBar = () => {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.todolist.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={LogoApp} inheritViewBox sx={{ color: 'primary.main' }} />
          <Typography
            variant='span'
            sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}
          >
            TaskCraft
          </Typography>
        </Box>
        <WorkSpaces />
        <Recent />
        <Starred />
        <Button variant='outlined' startIcon={<LibraryAddOutlinedIcon />}>
          Create
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ModeSelect />
        <TextField
          label='Search...'
          type='search'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <AccountCircle />
              </InputAdornment>
            )
          }}
        />
        <Tooltip title='Notifications'>
          <Badge color='secondary' variant='dot'>
            <NotificationsNoneOutlinedIcon color='action' />
          </Badge>
        </Tooltip>
        <Tooltip title='Profiles'>
          <Profile />
        </Tooltip>
      </Box>
    </Box>
  )
}

export default AppBar
