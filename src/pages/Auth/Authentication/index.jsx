import { Box, Button, Grid, SvgIcon, TextField, Typography } from '@mui/material'
import img1 from '@/assets/img1.png'
import img2 from '@/assets/img2.png'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation, useQuery } from '@tanstack/react-query'
import { signinUserAPI } from '@/apis/users.api'
import { loginUser } from '@/redux/userSile'
import { ReactComponent as LogoApp } from '@/assets/trello.svg'
import { confirmInviteEmailAPI, getInviteAPI } from '@/apis/boards.api'
import { toast } from 'react-toastify'

const Authentication = () => {
  const [user, setUser] = useState({ email: '', password: '' })
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

  // currying
  const handleChangeUserInput = (inputName) => (event) => {
    setUser((prev) => ({ ...prev, [inputName]: event.target.value }))
  }

  const navigate = useNavigate()
  const disPatch = useDispatch()

  const mutionUserLogin = useMutation({
    mutationFn: async () => {
      const res = await signinUserAPI(user)
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

  console.log('🚀 ~ userLogin ~ inviteeEmail:', inviteeEmail)
  console.log('🚀 ~ userLogin ~ user.email:', user.email)

  const userLogin = () => {
    if (!user.email || !user.password) {
      return
    }
    if (user.email !== inviteeEmail) {
      toast.error('To complete this action, log in to the account whose email you are trying to confirm.')
      return
    }
    mutionUserLogin.mutate()
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
            maxWidth: '400px',
            borderRadius: '3px',
            p: '25px 40px',
            boxShadow: 'rgba(0,0,0,0.1) 0 0 10px',
            height: '420px'
          }}
        >
          <Typography variant='h6' textAlign='center'>
            Log in to TaskCarft
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              userLogin()
            }}
          >
            <Typography variant='subtitle1' sx={{ mt: 3, mb: 0.5 }}>
              Email
            </Typography>
            <TextField
              value={user.email}
              onChange={handleChangeUserInput('email')}
              type='email'
              variant='outlined'
              size='small'
              sx={{ width: '100%' }}
              placeholder='Enter email'
            />

            <Typography variant='subtitle1' sx={{ mt: 2, mb: 0.5 }}>
              Password
            </Typography>
            <TextField
              value={user.password}
              onChange={handleChangeUserInput('password')}
              type='password'
              variant='outlined'
              size='small'
              sx={{ width: '100%', mb: 0.5 }}
              placeholder='Enter password'
            />

            <Typography sx={{ mt: 1, mb: 2, color: '#0552cc', textAlign: 'end' }}>Forgot password?</Typography>

            <Button
              type='submit'
              sx={{
                bgcolor: '#4F46E5',
                width: '100%',
                mb: 2
              }}
              variant='contained'
              disableElevation
            >
              Log in
            </Button>
          </form>

          <hr />

          <Typography sx={{ fontSize: '0.875rem', textDecoration: 'none', color: '#0552cc', textAlign: 'center' }}>
            Not a member? •{' '}
            <Link style={{ textDecoration: 'none', color: '#0552cc' }} to='/sign-up'>
              Sign up!
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
          <img src={img2} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Authentication
