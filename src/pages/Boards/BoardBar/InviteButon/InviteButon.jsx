import { sendInviteEmailAPI } from '@/apis/boards.api'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { Avatar, IconButton, Modal, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'

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
  const [inviteeEmail, setInviteeEmail] = useState('')

  const user = useSelector((state) => state.user.auth)

  const mutionSendEmail = useMutation({
    mutationFn: (data) => sendInviteEmailAPI(data),
    onSuccess: () => {
      toast.success('Invite email send successfully')
      setInviteeEmail('')
    },
    onError: () => {
      toast.error('Unknown recipient email')
      setInviteeEmail('')
    }
  })

  const { isPending } = mutionSendEmail

  const sendInviteEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteeEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    mutionSendEmail.mutate({
      inviteeEmail: inviteeEmail,
      inviterId: user._id,
      boardId: board._id
    })
  }

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
            <TextField
              type='email'
              autoFocus
              value={inviteeEmail}
              onChange={(e) => setInviteeEmail(e.target.value)}
              placeholder='Email address...'
              variant='outlined'
              size='small'
              fullWidth
            />

            <Button sx={{ bgcolor: '#4f46e5' }} onClick={sendInviteEmail} variant='contained'>
              {isPending ? <CircularProgress sx={{ color: 'white', display: 'flex' }} size='25px' /> : <>Invite</>}
            </Button>
          </Box>

          <Box sx={{ mt: 1 }}>
            {board?.userInBoard?.map((member) => (
              <Box key={member?._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Avatar size='small' sx={{ backgroundColor: member?.avatarColor }} src={member?.avatar}>
                    {member?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body'>
                      {member?.fullname} {user?._id === member?._id && '(you)'}
                    </Typography>
                    <Typography variant='caption'>@{member?.username}</Typography>
                  </Box>
                </Box>
                <Select
                  sx={{ height: '32px' }}
                  size='small'
                  value={
                    member?._id === board?.ownerId || board?.admins.some((admin) => admin === member?._id)
                      ? 'admin'
                      : 'member'
                  }
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
