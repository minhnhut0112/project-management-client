import { confirmInviteEmailAPI, getInviteAPI } from '@/apis/boards.api'
import { signupUserAPI } from '@/apis/users.api'
import img1 from '@/assets/img1.png'
import img2 from '@/assets/img2.png'
import { ReactComponent as LogoApp } from '@/assets/trello.svg'
import { loginUser } from '@/redux/userSile'
import CheckIcon from '@mui/icons-material/Check'
import { Box, Button, Grid, SvgIcon, TextField, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const formInterFace = {
  email: '',
  fullname: '',
  password: '',
  confirmPassword: ''
}

const ConfirmSignUp = () => {
  const [user, setUser] = useState(formInterFace)
  const [inviteeEmail, setInviteeEmail] = useState('')

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const inviteId = searchParams.get('inviteId')

  const inviteQuery = useQuery({ queryKey: ['invite', inviteId], queryFn: () => getInviteAPI(inviteId) })

  useEffect(() => {
    if (inviteQuery.data) {
      setInviteeEmail(inviteQuery.data.inviteeEmail)
    }
  }, [inviteQuery.data])

  const onChangeInput = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const navigate = useNavigate()
  const disPatch = useDispatch()

  const mutionsSignUp = useMutation({
    mutationFn: async (data) => {
      const res = await signupUserAPI(data)
      return res
    },
    onSuccess: async (data) => {
      if (!data) return

      localStorage.setItem('accessToken', data?.accessToken)
      disPatch(loginUser(data))

      const invited = await confirmInviteEmailAPI(inviteId)

      if (invited) {
        navigate(`/board/${invited?.boardId}`)
      }
    }
  })

  const handleSignUp = () => {
    mutionsSignUp.mutate({
      email: inviteeEmail,
      fullname: user.fullname,
      password: user.password,
      confirmPassword: user.confirmPassword
    })
  }

  return (
    <Box sx={{ bgcolor: '#f9fafc', height: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: '40px 0 50px 0', gap: 1 }}>
        <SvgIcon
          fontSize='large'
          component={LogoApp}
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            height: '42px'
          }}
        />
        <Typography
          variant='h4'
          sx={{
            fontWeight: 'bold',
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            cursor: 'pointer'
          }}
        >
          TaskCraft
        </Typography>
      </Box>
      <Grid container sx={{ display: 'flex', height: '80%', justifyContent: 'space-between' }}>
        <Grid xs={4} item sx={{ display: 'flex', alignItems: 'end' }}>
          <img src={img1} />
        </Grid>
        <Grid
          xs={3.25}
          item
          sx={{
            bgcolor: '#ffffff',
            maxWidth: '300px',
            borderRadius: '3px',
            p: '32px 50px',
            boxShadow: 'rgba(0,0,0,0.1) 0 0 10px',
            height: 'fit-content'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
            <Typography variant='h6' textAlign='center'>
              Verified email address
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#4cd137',
                borderRadius: '50%',
                width: '23px',
                height: '23px'
              }}
            >
              <CheckIcon fontSize='small' sx={{ color: 'white' }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Typography variant='body2'>Finish setting up your account</Typography>
          </Box>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSignUp()
            }}
          >
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 0.5 }}>
              Email
            </Typography>

            <Typography variant='subtitle1' sx={{ mb: 0.5, fontWeight: 'bold' }}>
              {inviteeEmail}
            </Typography>

            <Typography variant='subtitle1' sx={{ mt: 2, mb: 0.5 }}>
              Full Name
            </Typography>
            <TextField
              name='fullName'
              value={user.fullName}
              onChange={onChangeInput}
              type='text'
              variant='outlined'
              size='small'
              sx={{ width: '100%', mb: 0.5 }}
              placeholder='Enter fullname'
            />

            <Typography variant='subtitle1' sx={{ mt: 2, mb: 0.5 }}>
              Password
            </Typography>
            <TextField
              onChange={onChangeInput}
              name='password'
              type='password'
              variant='outlined'
              size='small'
              sx={{ width: '100%', mb: 0.5 }}
              placeholder='Enter password'
            />

            <Typography variant='subtitle1' sx={{ mt: 2, mb: 0.5 }}>
              Confirm Password
            </Typography>
            <TextField
              onChange={onChangeInput}
              name='confirmPassword'
              type='password'
              variant='outlined'
              size='small'
              sx={{ width: '100%', mb: 0.5 }}
              placeholder='Confirm password'
            />

            <Button
              type='submit'
              sx={{
                bgcolor: '#4F46E5',
                width: '100%',
                mb: 2,
                mt: 2
              }}
              variant='contained'
              disableElevation
            >
              Sign Up
            </Button>
          </form>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
          <img src={img2} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default ConfirmSignUp
