import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const user = useSelector((state) => state.user.auth)

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size='small'
        sx={{ padding: 0 }}
        aria-controls={open ? 'basic-menu-profile' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }} alt='avatar' src={user?.avatar}>
          M
        </Avatar>
      </IconButton>
      <Menu
        id='basic-menu-profile'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profile'
        }}
        sx={{ mt: 1 }}
      >
        <NavLink to='/sign-in' style={{ textDecoration: 'none', color: 'black' }} onClick={handleClose}>
          <MenuItem sx={{ gap: 1 }}>
            <Avatar size='small' /> Profile
          </MenuItem>
        </NavLink>
        <MenuItem sx={{ gap: 1 }} onClick={handleClose}>
          <Avatar size='small' /> My account
        </MenuItem>
        <Divider />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profile
