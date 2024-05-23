import { updateBoardAPI } from '@/apis/boards.api'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined'
import { Avatar, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const AboutBoard = ({ handleChangeContent, handleClose, board }) => {
  const checkPermission = (member, board) => {
    if (member && board) {
      if (member._id === board.ownerId) {
        return true
      }

      if (board.admins && board.admins.some((admin) => admin === member._id)) {
        return true
      }

      if (board.members && board.members.some((memberId) => memberId === member._id)) {
        return false
      }
    }

    return 0
  }

  const [openDescriptionForm, setOpenDescriptionForm] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    setDescription(board.description)
  }, [board.description])

  const handleChange = (e) => {
    setDescription(e.target.value)
  }

  useEffect(() => {
    const length = description?.length
    const input = document.getElementById('outlined-multiline-static')

    if (input) {
      input.setSelectionRange(length, length)
    }
  }, [description, openDescriptionForm])

  const mutationUpdateDescription = useMutation({
    mutationFn: async (data) => await updateBoardAPI(board._id, data)
  })

  const handleUpdateDescription = () => {
    if (!description) {
      setOpenDescriptionForm(false)
      return
    }

    mutationUpdateDescription.mutate({
      description: description
    })
    setOpenDescriptionForm(false)
  }
  return (
    <Box sx={{ width: 340, p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          onClick={() => {
            handleChangeContent('menu')
          }}
          aria-label='delete'
        >
          <ArrowBackIosIcon fontSize='small' sx={{ fontSize: '14px' }} />
        </IconButton>
        <Typography sx={{ fontSize: '16px' }} variant='h6'>
          About this board
        </Typography>
        <IconButton onClick={handleClose} aria-label='delete'>
          <ClearOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>

      <Divider sx={{ m: 1 }} />

      <Box sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ManageAccountsOutlinedIcon />
          Board admins
        </Box>

        <Box sx={{ display: 'flex', gap: 0.25, mt: 1, mb: 2 }}>
          {board?.userInBoard?.map((user) => {
            const permission = checkPermission(user, board)
            if (permission) {
              return (
                <div
                  style={{
                    position: 'relative'
                  }}
                  key={user?._id}
                >
                  <Avatar
                    sx={{ bgcolor: user?.avatarColor, width: 34, height: 34 }}
                    src={user?.avatar}
                    alt={user?.username}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>

                  <KeyboardDoubleArrowUpIcon
                    sx={{ fontSize: 15 }}
                    style={{
                      position: 'absolute',
                      bottom: -3,
                      right: -5,
                      color: 'yellow',
                      backgroundColor: permission !== 0 ? '#a4b0be' : 'transparent',
                      borderRadius: '50%'
                    }}
                  />
                </div>
              )
            }
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 0.75 }}>
            <ViewHeadlineOutlinedIcon />
            <Typography variant='cation' sx={{ cursor: 'pointer', fontSize: '16ox' }}>
              Description
            </Typography>
          </Box>
          {!openDescriptionForm && description && (
            <Chip
              sx={{
                fontSize: '15px',
                justifyContent: 'start',
                borderRadius: '4px',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
                border: 'none'
              }}
              onClick={() => setOpenDescriptionForm(true)}
              label='Edit'
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {!description || openDescriptionForm ? (
            <Box sx={{ width: '100%' }}>
              {!openDescriptionForm ? (
                <Chip
                  onClick={() => setOpenDescriptionForm(true)}
                  sx={{
                    borderRadius: '4px',
                    width: '100%',
                    justifyContent: 'start',
                    alignItems: 'start',
                    p: '5px 5px 0 0',
                    height: '50px',
                    mt: 1
                  }}
                  label='Add a more detailed description…'
                  clickable
                  variant='outlined'
                />
              ) : (
                <Box sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    autoComplete='false'
                    id='outlined-multiline-static'
                    autoFocus
                    value={description}
                    sx={{ mt: 1, width: '100%', mb: 1 }}
                    placeholder='Add a more detailed description…'
                    onChange={handleChange}
                    multiline
                    rows={4}
                    inputProps={{ style: { cursor: 'auto' } }}
                  />
                  <Button onClick={handleUpdateDescription} variant='contained' sx={{ mx: 1 }}>
                    Save
                  </Button>
                  <Button onClick={() => setOpenDescriptionForm(false)} variant='text'>
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Typography onClick={() => setOpenDescriptionForm(true)} sx={{ fontSize: '16px', mt: 1 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AboutBoard
