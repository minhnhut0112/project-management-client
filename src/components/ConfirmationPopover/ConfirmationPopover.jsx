import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Button, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'

const ConfirmationPopover = ({ anchorEl, handleClose, id, open, onConfirm, title, description }) => {
  const handleConfirm = () => {
    onConfirm()
    handleClose()
  }

  return (
    <Popover
      data-no-dnd
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      sx={{ mt: 1 }}
    >
      <div style={{ padding: '16px', maxWidth: '340px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ marginLeft: '15px' }}></Box>
          <Typography sx={{ fontSize: '16px' }} variant='h6'>
            {title}
          </Typography>
          <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
            <ClearOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>
        <Typography variant='caption' fontSize={14}>
          {description}
        </Typography>
        <Button
          sx={{
            bgcolor: '#c9372c',
            width: '100%',
            mt: 1,
            color: '#fff',
            '&:hover': { bgcolor: '#c9372c', color: '#fff' }
          }}
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </div>
    </Popover>
  )
}

export default ConfirmationPopover
