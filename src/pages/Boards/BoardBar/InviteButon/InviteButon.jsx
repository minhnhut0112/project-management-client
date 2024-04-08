import { changeToAdminAPI, changeToMemberAPI, removeFromBoardlAPI, sendInviteEmailAPI } from '@/apis/boards.api'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { Avatar, IconButton, Modal, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

  const queryClient = useQueryClient()

  const mutionChangeToAdmins = useMutation({
    mutationFn: (data) => changeToAdminAPI(data.boardId, data.userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const mutionChangeToMember = useMutation({
    mutationFn: (data) => changeToMemberAPI(data.boardId, data.userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const changePermission = (e, userId) => {
    const permission = parseInt(e.target.value)
    if (permission === 2) {
      mutionChangeToAdmins.mutate({ boardId: board?._id, userId: userId })
    } else if (permission === 1) {
      mutionChangeToMember.mutate({ boardId: board?._id, userId: userId })
    }
  }

  const checkPermission = (member, board) => {
    if (member && board) {
      if (member._id === board.ownerId) {
        return 2
      }

      if (board.admins && board.admins.some((admin) => admin === member._id)) {
        return 2
      }

      if (board.members && board.members.some((memberId) => memberId === member._id)) {
        return 1
      }
    }

    return 0
  }

  const mutionRemoveFromBoard = useMutation({
    mutationFn: (data) => removeFromBoardlAPI(data.boardId, data.userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const removeFromBoard = (userId) => {
    mutionRemoveFromBoard.mutate({ boardId: board?._id, userId: userId })
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
            {board?.userInBoard
              ?.sort((a, b) => {
                if (user?._id === a?._id) return -1
                if (user?._id === b?._id) return 1
                return 0
              })
              ?.map((member) => (
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
                    onChange={(e) => changePermission(e, member?._id)}
                    sx={{ height: '32px' }}
                    size='small'
                    value={checkPermission(member, board)}
                  >
                    <MenuItem value={2}>Admin</MenuItem>
                    <MenuItem value={1}>Member</MenuItem>
                    <MenuItem onClick={() => removeFromBoard(member?._id)}>
                      {user?._id === member?._id ? 'Leave board' : 'Remove from board'}
                    </MenuItem>
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
