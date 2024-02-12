import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { IconButton, Modal, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: '5px'
}

const InviteButon = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Text in a modal
            </Typography>
            <IconButton onClick={() => setOpen(false)} aria-label='invite-buton'>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1 }}>
            <TextField placeholder='Email address or name' variant='outlined' size='small' fullWidth />
            <Button variant='contained'>Invite</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default InviteButon
