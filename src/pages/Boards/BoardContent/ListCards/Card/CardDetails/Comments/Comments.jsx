import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import InputBase from '@mui/material/InputBase'

const Comments = ({ card }) => {
  const user = useSelector((state) => state.user.auth)
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 2 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: user?.avatarColor
          }}
          src={user?.avatar}
        >
          {user?.username?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            width: '100%',
            alignItems: 'center',
            border: '1px solid #95afc0',
            borderRadius: '5px',
            pl: 1
          }}
        >
          <InputBase placeholder='Write a comment...' fullWidth size='small' />
          <IconButton>
            <SendIcon color='primary' />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        {card?.comments?.map((comment, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: comment?.avatarColor
              }}
              src={comment?.avatar}
            >
              {comment?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant='h6' sx={{ fontSize: '14px' }}>
                  {comment?.username}
                </Typography>
                <Typography variant='body2' sx={{ fontSize: '14px' }}>
                  Jun 16 at 20:30 PM
                </Typography>
              </Box>
              <TextField
                value={comment?.content}
                placeholder='Write a comment...'
                InputProps={{
                  readOnly: true
                }}
                fullWidth
                size='small'
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Comments
