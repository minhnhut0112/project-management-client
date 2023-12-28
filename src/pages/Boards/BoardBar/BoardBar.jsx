import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import PublicIcon from '@mui/icons-material/Public'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { capitalizeFirstLetter } from '@/utils/formatters'

const menuStyle = {
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px'
}

const BoardBar = ({ board }) => {
  return (
    <Box
      sx={{
        height: (theme) => theme.todolist.boardBarHeight,
        width: '100%',
        paddingX: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#576574' : '#dfe6e9')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip sx={menuStyle} label={board?.title} clickable icon={<DashboardIcon />} />
        <Chip sx={menuStyle} label={capitalizeFirstLetter(board?.type)} clickable icon={<PublicIcon />} />
        <Chip sx={menuStyle} label='Add to Drive' clickable icon={<AddToDriveIcon />} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0be'
              }
            }
          }}
        >
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
          <Tooltip title='datmap'>
            <Avatar
              alt='datmap'
              // src='https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/323626590_880990436513026_6674864588010330093_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=fPT8bvhDfO8AX8NxK2z&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfAG31IBQRzMkfLb8V5-iL8qbelihNXp2q2WRGaD8PkRVw&oe=6573D551'
            />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
          <Tooltip title='minhnhut'>
            <Avatar
              alt='minhnhut'
              src='https://yt3.ggpht.com/yti/ADpuP3NEF178kiCGdCsoST-0Adr2zq0FhKaeG5_Fm0G90g=s88-c-k-c0x00ffffff-no-rj-mo'
            />
          </Tooltip>
        </AvatarGroup>
        <Button
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            '&:hover': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            }
          }}
          variant='outlined'
          startIcon={<PersonAddAltOutlinedIcon />}
        >
          Invite
        </Button>
      </Box>
    </Box>
  )
}

export default BoardBar
