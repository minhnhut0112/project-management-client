import { createNewIssueAPI } from '@/apis/boards.api'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const NewIssue = ({ handleChangeIndex, board }) => {
  const [issueTitle, setIssueTitle] = useState('')
  const [issueDescription, setIssueDescription] = useState('')

  const user = useSelector((state) => state.user.auth)
  const queryClient = useQueryClient()

  const mutionAddNewIssue = useMutation({
    mutationFn: (issue) => createNewIssueAPI(board?._id, issue),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
      handleChangeIndex(0)
    }
  })

  const handleAddNewIssue = () => {
    mutionAddNewIssue.mutate({
      title: issueTitle,
      description: issueDescription,
      createAt: new Date().valueOf(),
      comments: [],
      owner: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        avatar: user.avatar,
        avatarColor: user.avatarColor
      },
      opened: true
    })
    setIssueDescription('')
    setIssueTitle('')
  }

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
        <Avatar alt={user.username} src={user.avatar} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption' sx={{ fontSize: '18px' }}>
            Add a title
          </Typography>
          <TextField
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)}
            autoFocus
            sx={{ mt: 1, width: 800, mb: 2 }}
            id='outlined-basic'
            size='small'
            variant='outlined'
          />
          <Typography variant='caption' sx={{ fontSize: '18px' }}>
            Add a description
          </Typography>
          <TextField
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            id='outlined-multiline-static'
            sx={{ mt: 1, width: '100%', mb: 1 }}
            placeholder='Add your description here...'
            multiline
            rows={6}
            inputProps={{ style: { cursor: 'auto' } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              disabled={!issueTitle || !issueDescription}
              onClick={handleAddNewIssue}
              sx={{
                bgcolor: '#4F46E5',
                boxShadow: 'none',
                height: '40px',
                mt: 1,
                '&:hover': {
                  bgcolor: '#4F46E5',
                  boxShadow: 'none'
                }
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
