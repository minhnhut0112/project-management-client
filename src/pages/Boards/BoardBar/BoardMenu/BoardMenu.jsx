import { ReactComponent as ActivitySVG } from '@/assets/activity-svg.svg'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import RemoveIcon from '@mui/icons-material/Remove'
import { SvgIcon, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Popover from '@mui/material/Popover'
import { useState } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const BoardMenu = ({ board }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon sx={{ color: 'white' }} />
      </IconButton>
      <Box>
        <Popover
          data-no-dnd
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          sx={{ mx: 2 }}
        >
          <Box sx={{ width: 280, p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ marginLeft: '35px' }}></Box>
              <Typography sx={{ fontSize: '16px' }} variant='h6'>
                Menu
              </Typography>
              <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
                <ClearOutlinedIcon />
              </IconButton>
            </Box>

            <Divider sx={{ m: 1 }} />

            <MenuList sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <MenuItem>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText>About this board</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <SvgIcon
                    component={ActivitySVG}
                    fontSize='small'
                    inheritViewBox
                    sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
                  />
                </ListItemIcon>
                <ListItemText>Activity</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ArchiveOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Archived items</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <Avatar src={board.cover} sx={{ width: 22, height: 22 }} variant='rounded' />
                </ListItemIcon>
                <ListItemText>Change background</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <LocalOfferOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Labels</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem>
                <ListItemIcon>
                  <RemoveIcon />
                </ListItemIcon>
                <ListItemText>Close board</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>Leave board</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <DeleteOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Delete board</ListItemText>
              </MenuItem>
            </MenuList>
          </Box>
        </Popover>
      </Box>
    </div>
  )
}

export default BoardMenu
