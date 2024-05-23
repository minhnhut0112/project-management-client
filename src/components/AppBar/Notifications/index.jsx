import Badge from '@mui/material/Badge'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { useState } from 'react'
import NotificationsPopover from './NotificationsPopover/NotificationsPopover'
import { Box } from '@mui/material'

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [showtoti, setshowtoti] = useState(true)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setshowtoti(false)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <Box>
      <Badge color='warning' variant={showtoti ? 'dot' : ''}>
        <NotificationsNoneOutlinedIcon
          onClick={handleClick}
          sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
        />
      </Badge>
      <NotificationsPopover id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Box>
  )
}

export default Notification
