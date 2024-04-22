import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Avatar, Box, Button, Chip, TextField, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'

const IssueDetails = ({ handleChangeIndex, issue }) => {
  const user = useSelector((state) => state.user.auth)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          Issue details
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between', width: 1000 }}>
        <Box>
          <Typography variant='h6'>{issue.title} </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip label='success' color='success' />
            <Typography>
              {issue.ownerUsername} opened this issue {dayjs(issue.createAt).format('MMM D, YYYY [at] h:mm A')}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button variant='outlined' sx={{ mr: 1 }}>
            Edit
          </Button>
          <Button
            sx={{
              bgcolor: '#4F46E5'
            }}
            variant='contained'
          >
            New issue
          </Button>
        </Box>
      </Box>

      <Divider sx={{ width: 1060, mt: 2, bgcolor: '#c8d6e5', height: 1 }} />

      <Box sx={{ mt: 3 }}>
        {issue?.comments?.map((comment, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: user?.avatarColor }} alt='avatar' src={comment?.avatar}>
                {comment?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box
                  sx={{
                    bgcolor: '#f6f8fa',
                    p: 1,
                    border: '1px solid #c8d6e5',
                    borderRadius: ' 4px 4px 0px 0px ',
                    minWidth: { md: 1000, sm: 500, xs: 200 }
                  }}
                >
                  {comment?.username} commented {dayjs(comment.timestamp).format('MMM D, YYYY [at] h:mm A')}
                </Box>
                <Box
                  sx={{
                    p: 1,
                    minHeight: 100,
                    border: '1px solid #c8d6e5',
                    borderRadius: '0px 0px 4px 4px ',
                    minWidth: { md: 1000, sm: 500, xs: 200 }
                  }}
                >
                  {comment.content}
                </Box>
                <Divider sx={{ height: 50, width: '1px', bgcolor: '#c8d6e5', ml: 3 }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ width: 1060, bgcolor: '#c8d6e5', height: 1 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: user?.avatarColor }} alt='avatar' src={user?.avatar}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant='h6'>Add a comment</Typography>
          <TextField
            id='outlined-multiline-static'
            sx={{ mt: 1, mb: 1, minWidth: { md: 1000, sm: 500, xs: 200 } }}
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

export default IssueDetails
