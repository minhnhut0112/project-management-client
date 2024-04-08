import { Typography } from '@mui/material'
import Popover from '@mui/material/Popover'

const NotificationsPopover = ({ anchorEl, handleClose, id, open }) => {
  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </div>
  )
}

export default NotificationsPopover
