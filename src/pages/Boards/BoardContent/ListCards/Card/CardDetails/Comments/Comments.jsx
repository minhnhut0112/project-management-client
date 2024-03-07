import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import InputBase from '@mui/material/InputBase'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'

const socket = io('http://localhost:8017')

const Comments = ({ card }) => {
  const user = useSelector((state) => state.user.auth)

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [socketConnected, setSocketConnected] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (card.comments) {
      setMessages(card.comments)
    }
  }, [card.comments])

  useEffect(() => {
    const socket = io('http://localhost:8017')
    setSocketConnected(true)
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [msg, ...prev])
      queryClient.invalidateQueries({ queryKey: ['board'] })
    })

    return () => {
      socket.disconnect()
      setSocketConnected(false)
    }
  }, [queryClient, messages])

  const sendMessage = () => {
    if (socketConnected && inputMessage) {
      socket.emit('card-comment', {
        id: card._id,
        msg: {
          _id: user._id,
          avatar: user.avatar,
          username: user.username,
          avatarColor: user.avatarColor,
          content: inputMessage.trim(),
          timestamp: new Date().valueOf()
        }
      })
      setInputMessage('')
    } else {
      // Handle case when socket is not connected
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
                    {comment?.username}
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
