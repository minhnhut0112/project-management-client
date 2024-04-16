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
import AboutBoard from './AboutBoard/AboutBoard'
import Activity from './Activity/Activity'
import Archive from './Archived/Archived'
import ChangeBackground from './ChangeBG/ChangeBG'
import Labels from './Labels/Labels'

const BoardMenu = ({ board }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setContent('menu')
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const [content, setContent] = useState('menu')

  const handleChangeContent = (content) => {
    setContent(content)
  }

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
          {content === 'menu' && (
            <Box sx={{ width: 280, p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ marginLeft: '35px' }}></Box>
                <Typography sx={{ fontSize: '16px' }} variant='h6'>
                  Menu
                </Typography>
                <IconButton onClick={handleClose} aria-label='delete'>
                  <ClearOutlinedIcon fontSize='small' />
                </IconButton>
              </Box>

              <Divider sx={{ m: 1 }} />

              <MenuList sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <MenuItem onClick={() => setContent('aboutboard')}>
                  <ListItemIcon>
                    <InfoOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>About this board</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setContent('activity')}>
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

                <MenuItem onClick={() => setContent('archived')}>
                  <ListItemIcon>
                    <ArchiveOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Archived items</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setContent('changebg')}>
                  <ListItemIcon>
                    <Avatar src={board.cover} sx={{ width: 22, height: 22 }} variant='rounded' />
                  </ListItemIcon>
                  <ListItemText>Change background</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => setContent('labels')}>
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
          )}

          {content === 'aboutboard' && (
            <AboutBoard handleChangeContent={handleChangeContent} handleClose={handleClose} board={board} />
          )}

          {content === 'activity' && (
            <Activity handleChangeContent={handleChangeContent} handleClose={handleClose} board={board} />
          )}

          {content === 'archived' && (
            <Archive handleChangeContent={handleChangeContent} handleClose={handleClose} board={board} />
          )}

          {content === 'changebg' && (
            <ChangeBackground handleChangeContent={handleChangeContent} handleClose={handleClose} board={board} />
          )}

          {content === 'labels' && (
            <Labels handleChangeContent={handleChangeContent} handleClose={handleClose} board={board} />
          )}
        </Popover>
      </Box>
    </div>
  )
}

export default BoardMenu
