import { Box, Typography } from '@mui/material'
import Popover from '@mui/material/Popover'

const NotificationsPopover = ({ anchorEl, handleClose, id, open }) => {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      sx={{ mt: 2, boxShadow: 'none' }}
    >
      <Box sx={{ width: 400 }}>
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Box>
    </Popover>
  )
}

export default NotificationsPopover
