import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Avatar, Box, Button, TextField, Typography } from '@mui/material'

const NewIssue = ({ handleChangeIndex }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'start' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => handleChangeIndex(0)}
        >
          <HomeOutlinedIcon />
          <Typography sx={{ fontSize: '18px' }} variant='body'>
            Issues /
          </Typography>
        </Box>
        <Typography variant='body' sx={{ fontSize: '18px', color: 'black' }}>
          Create new issue
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption' sx={{ fontSize: '18px' }}>
            Add a title
          </Typography>
          <TextField autoFocus sx={{ mt: 1, width: 800, mb: 2 }} id='outlined-basic' size='small' variant='outlined' />
          <Typography variant='caption' sx={{ fontSize: '18px' }}>
            Add a description
          </Typography>
          <TextField
            id='outlined-multiline-static'
            sx={{ mt: 1, width: '100%', mb: 1 }}
            placeholder='Add your description here...'
            multiline
            rows={6}
            inputProps={{ style: { cursor: 'auto' } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              sx={{
                bgcolor: '#4F46E5',
                height: '40px',
                mt: 1
              }}
              variant='contained'
            >
              Submit new issue
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default NewIssue
