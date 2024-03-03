import CloseIcon from '@mui/icons-material/Close'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { Avatar, IconButton, Modal, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useState } from 'react'

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

const InviteButon = ({ board }) => {
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
              Share board
            </Typography>
            <IconButton onClick={() => setOpen(false)} aria-label='invite-buton'>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1, mb: 2 }}>
            <TextField placeholder='Email address or name' variant='outlined' size='small' fullWidth />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Select size='small' value='member'>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='member'>Member</MenuItem>
                <MenuItem>Remove from board</MenuItem>
              </Select>
              <Button sx={{ bgcolor: '#4f46e5' }} variant='contained'>
                Invite
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            {board?.userInBoard?.map((member) => (
              <Box key={member?._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Avatar size='small' sx={{ backgroundColor: member?.avatarColor }} src={member?.avatar}>
                    {member?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Typography>{member?.username}</Typography>
                </Box>
                <Select
                  sx={{ height: '32px' }}
                  size='small'
                  value={member?._id === board?.ownerId ? 'admin' : 'member'}
                >
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='member'>Member</MenuItem>
                  <MenuItem>Remove from board</MenuItem>
                </Select>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

export default InviteButon
