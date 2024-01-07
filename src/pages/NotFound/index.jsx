import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1.5,
          mb: 5
        }}
      >
        <Typography variant='body' sx={{ fontSize: '1rem', color: '#4F46E5' }}>
          404
        </Typography>
        <Typography variant='h2' sx={{ fontSize: '3rem', fontWeight: '700' }}>
          Page not found
        </Typography>
        <Typography variant='caption' sx={{ fontSize: '1rem' }}>
          Sorry, we couldn’t find the page you’re looking for.
        </Typography>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              color: '#4F46E5'
            }}
          >
            <KeyboardBackspaceOutlinedIcon />
            <Typography variant='caption' sx={{ fontSize: '1rem' }}>
              Go back home
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  )
}

export default NotFound
