import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import InputBase from '@mui/material/InputBase'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCommentstAPI } from '@/apis/cards.api'

const Comments = ({ card }) => {
  const user = useSelector((state) => state.user.auth)

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    if (card.comments) {
      setMessages(card.comments)
    }
  }, [card.comments])

  const queryClient = useQueryClient()

  const mutioncreateComment = useMutation({
    mutationFn: async (data) => await createCommentstAPI(card._id, data, user.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
    }
  })

  const sendMessage = () => {
    if (inputMessage) {
      mutioncreateComment.mutate({
        _id: user._id,
        avatar: user.avatar,
        username: user.username,
        fullname: user.fullname,
        avatarColor: user.avatarColor,
        content: inputMessage.trim(),
        timestamp: new Date().valueOf()
      })
      setInputMessage('')
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 0.75, mt: 1 }}>
        <CommentOutlinedIcon fontSize='small' />
        <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          Comments
        </Typography>
      </Box>

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
            as='form'
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
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
            <InputBase
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder='Write a comment...'
              fullWidth
              size='small'
            />
            <IconButton type='submit'>
              <SendIcon color='primary' />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          {messages?.map((comment, index) => (
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
                    {comment?.fullname}
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '14px' }}>
                    {dayjs(comment.timestamp).format('MMM D, YYYY [at] h:mm A')}
                  </Typography>
                </Box>
                <TextField
                  value={comment?.content}
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
    </>
  )
}

export default Comments
