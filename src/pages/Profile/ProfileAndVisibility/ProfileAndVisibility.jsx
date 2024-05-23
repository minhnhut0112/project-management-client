import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { getUserAPI, updateAvaterUserAPI, updateUserAPI } from '@/apis/users.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { toast } from 'react-toastify'
import { loginUser } from '@/redux/userSile'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const ProfileAndVisibility = () => {
  const user = useSelector((state) => state.user.auth)

  const [userState, setUserState] = useState([])
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (user) {
      setUserState(user)
    }
  }, [user, setUserState])

  const dispatch = useDispatch()

  const handleGetDetailsUser = async (id, accessToken) => {
    const res = await getUserAPI(id)
    dispatch(loginUser({ ...res, accessToken: accessToken }))
  }

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0]

    const imageUrl = URL.createObjectURL(newFile)
    setUserState((prev) => ({ ...prev, avatar: imageUrl }))

    const formData = new FormData()
    formData.append('file', newFile)

    if (!newFile) return

    const res = await updateAvaterUserAPI(user._id, formData, user.accessToken)

    if (res) {
      toast.success('Uploaded avatar')
      const accessToken = user?.accessToken || localStorage.getItem('accessToken')
      handleGetDetailsUser(user._id, accessToken)
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  }

  const queryClient = useQueryClient()

  const mutionUpdateUser = useMutation({
    mutationFn: (data) => updateUserAPI(user?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
    }
  })

  const handleUpdateUser = () => {
    if (!userState.fullname) {
      setUserState(user)
      setEditMode(false)
      return
    }

    mutionUpdateUser.mutate({ fullname: userState?.fullname })
    setEditMode(false)
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box>
          <Typography variant='h6' sx={{ fontSize: '24px', color: '#172B4D', mb: 2 }}>
            Profile and visibility
          </Typography>
          <Typography variant='body' sx={{ fontSize: '16px', color: '#172B4D', mb: 2 }}>
            Manage your personal information, and control which information other people see and apps <br /> may access.
          </Typography>
          <br />
          <Typography variant='h6' sx={{ fontSize: '20px', color: '#172B4D', mb: 2, mt: 2, fontWeight: 450 }}>
            Profile photo
          </Typography>

          <Box sx={{ width: 680 }}>
            <Box sx={{ mb: 1, display: 'flex', gap: 3, alignItems: 'end' }}>
              <Avatar src={userState?.avatar} sx={{ bgcolor: userState?.avatarColor, width: 100, height: 100 }}>
                {userState?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                sx={{ width: 170, height: 40, bgcolor: '#0c66e4' }}
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload photo
                <VisuallyHiddenInput accept='.jpg, .jpeg, .png, .webp' onChange={handleFileChange} type='file' />
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0 }}>
            <Typography variant='h6' sx={{ fontSize: '20px', color: '#172B4D', mb: 2, mt: 2, fontWeight: 450 }}>
              About you
            </Typography>
            <IconButton onClick={() => setEditMode(true)} aria-label='delete'>
              <EditOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>

          <Box sx={{ width: 680, boxShadow: '0px 1px 1px #091E4240, 0px 0px 1px #091E424F', p: 2 }}>
            <Typography variant='body' sx={{ fontSize: '16px', fontWeight: 450 }}>
              Full name:
            </Typography>
            {!editMode ? (
              <Box
                sx={{
                  p: 1.5,
                  mt: 0.5,
                  mb: 0.5
                }}
              >
                <Box>{userState?.fullname}</Box>
              </Box>
            ) : (
              <Box sx={{ mt: 0.5, mb: 0.5, display: 'flex', alignItems: 'end', gap: 1 }}>
                <TextField
                  onChange={(e) => setUserState((prev) => ({ ...prev, fullname: e.target.value }))}
                  autoFocus
                  sx={{ mt: 1 }}
                  value={userState?.fullname}
                  fullWidth
                  size='small'
                />
                <Box sx={{ display: 'flex', alignItems: 'end', gap: 1 }}>
                  <Button
                    onClick={handleUpdateUser}
                    sx={{
                      height: '40px',
                      bgcolor: '#0c66e4',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#0c66e4',
                        boxShadow: 'none'
                      }
                    }}
                    variant='contained'
                    startIcon={<CheckIcon />}
                  >
                    Save
                  </Button>
                  <IconButton onClick={() => setEditMode(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
            <Typography variant='body' sx={{ fontSize: '16px', fontWeight: 450 }}>
              Username:
            </Typography>
            <Box sx={{ p: 1.5, mt: 0.5, mb: 0.5 }}>
              <Box>{userState?.username}</Box>
            </Box>
            <Typography variant='body' sx={{ fontSize: '16px', fontWeight: 450 }}>
              Email address:
            </Typography>
            <Box sx={{ p: 1.5, mt: 0.5, mb: 0.5 }}>
              <Box>{userState?.email}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default ProfileAndVisibility
