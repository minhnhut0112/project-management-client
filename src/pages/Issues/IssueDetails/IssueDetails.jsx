import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Avatar, Box, Button, Chip, TextField, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editIssueAPI, updateIssueAPI } from '@/apis/boards.api'
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined'

const IssueDetails = ({ handleChangeIndex, issueid, board }) => {
  const [comment, setComment] = useState('')
  const [issue, setIssue] = useState(null)
  const [openIssueTitleForm, setOpenIssueTitleForm] = useState(false)

  useEffect(() => {
    const filteredIssues = board.issues.filter((issue) => issue._id === issueid)

    if (filteredIssues.length > 0) {
      setIssue(filteredIssues[0])
    } else {
      setIssue(null)
    }
  }, [board, issueid])

  const user = useSelector((state) => state.user.auth)
  const queryClient = useQueryClient()

  const mutionAddNewComment = useMutation({
    mutationFn: (issue) => updateIssueAPI(board?._id, issue),
    onSuccess: () => queryClient.invalidateQueries('board')
  })

  const handleAddNewComment = () => {
    mutionAddNewComment.mutate({
      issue: {
        _id: issue._id,
        comment: {
          username: user.username,
          fullname: user.fullname,
          avatar: user.avatar,
          avatarColor: user.avatarColor,
          timestamp: new Date().valueOf(),
          content: comment
        }
      }
    })
    setComment('')
  }

  const [issuetitle, setIssueTitle] = useState(issue?.title)

  const mutionEditIssue = useMutation({
    mutationFn: (issue) => editIssueAPI(board?._id, issue),
    onSuccess: () => queryClient.invalidateQueries('board')
  })

  const handleEditTitleIssue = () => {
    if (issuetitle === issue.title) {
      setOpenIssueTitleForm(false)
      return
    }

    mutionEditIssue.mutate({
      issue: {
        _id: issue._id,
        title: issuetitle
      }
    })
    setOpenIssueTitleForm(false)
  }

  const handleChangeOpenIssue = () => {
    mutionEditIssue.mutate({
      issue: {
        _id: issue._id,
        opened: !issue?.opened
      }
    })
  }
  return (
    <>
      {issue && (
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
            <Box sx={{ width: '80%' }}>
              <Box sx={{ width: '100%', height: 40 }}>
                {openIssueTitleForm ? (
                  <TextField
                    fullWidth
                    type='text'
                    value={issuetitle}
                    autoFocus
                    data-no-dnd='true'
                    onChange={(e) => setIssueTitle(e.target.value)}
                    size='small'
                    sx={{
                      '& label': {
                        color: 'text.primary'
                      },

                      '& label.Mui-focused': {
                        color: (theme) => theme.palette.primary.main
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&:hover fieldset': {
                          borderColor: (theme) => theme.palette.primary.main
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: (theme) => theme.palette.primary.main
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        borderRadius: 1
                      }
                    }}
                  />
                ) : (
                  <Typography variant='h6'>{issue?.title} </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip
                  sx={{ bgcolor: issue?.opened ? 'success' : '#8d50df' }}
                  icon={issue?.opened ? <AdjustOutlinedIcon /> : <CheckCircleOutlineOutlinedIcon />}
                  label={issue?.opened ? 'Open' : 'Closed'}
                  color='success'
                />
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Typography variant='body' sx={{ fontSize: '14px', color: '#1f2238', fontWeight: 500 }}>
                    {issue?.owner?.username}{' '}
                  </Typography>{' '}
                  <Typography>opened this issue {dayjs(issue?.createAt).format('MMM D, YYYY [at] h:mm A')}</Typography>
                </Box>
              </Box>
            </Box>

            {openIssueTitleForm ? (
              <Box>
                <Button onClick={handleEditTitleIssue} variant='contained' sx={{ mr: 1, bgcolor: '#4F46E5' }}>
                  Save
                </Button>
                <Button
                  onClick={() => setOpenIssueTitleForm(false)}
                  sx={{
                    color: 'black',
                    borderColor: 'black',
                    '&:hover': {
                      borderColor: 'black'
                    }
                  }}
                  variant='outlined'
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box>
                {user?._id === issue?.owner?._id && (
                  <Button
                    variant='outlined'
                    onClick={() => {
                      setOpenIssueTitleForm(true)
                      setIssueTitle(issue?.title)
                    }}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => handleChangeIndex(1)}
                  sx={{
                    bgcolor: '#4F46E5'
                  }}
                  variant='contained'
                >
                  New issue
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ width: 1060, mt: 2, bgcolor: '#c8d6e5', height: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
            <Avatar
              sx={{ width: 32, height: 32, bgcolor: issue?.owner?.avatarColor }}
              alt='avatar'
              src={issue?.owner?.avatar}
            >
              {issue?.owner?.username?.charAt(0).toUpperCase()}
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
                <Typography variant='body' sx={{ fontSize: '14px', color: '#1f2238', fontWeight: 500 }}>
                  {issue?.owner?.username}{' '}
                </Typography>
                commented {dayjs(issue?.createAt).format('MMM D, YYYY [at] h:mm A')}
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
                <Typography variant='body' sx={{ whiteSpace: 'pre-line', fontSize: '16px' }}>
                  {issue?.description}
                </Typography>
              </Box>
              <Divider sx={{ height: 50, width: '1px', bgcolor: '#c8d6e5', ml: 3 }} />
            </Box>
          </Box>

          <Box>
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
                      <Typography variant='body' sx={{ fontSize: '14px', color: '#1f2238', fontWeight: 600 }}>
                        {comment?.username}{' '}
                      </Typography>
                      commented {dayjs(comment.timestamp).format('MMM D, YYYY [at] h:mm A')}
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
                      <Typography sx={{ whiteSpace: 'pre-line' }}>{comment.content}</Typography>
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
                autoFocus
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                id='outlined-multiline-static'
                sx={{ mt: 1, mb: 1, minWidth: { md: 1000, sm: 500, xs: 200 } }}
                placeholder='Add your description here...'
                multiline
                rows={6}
                inputProps={{ style: { cursor: 'auto' } }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
                {!issue?.opened ? (
                  <>
                    {user?._id === issue?.owner?._id && (
                      <Button
                        onClick={handleChangeOpenIssue}
                        startIcon={<LoopOutlinedIcon />}
                        sx={{ height: '40px', mt: 1 }}
                        variant='outlined'
                      >
                        Reopen issue
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {user?._id === issue?.owner?._id && (
                      <Button
                        onClick={handleChangeOpenIssue}
                        startIcon={<CheckCircleOutlineOutlinedIcon />}
                        sx={{ height: '40px', mt: 1 }}
                        variant='outlined'
                      >
                        Closed Issues
                      </Button>
                    )}
                  </>
                )}

                <Button
                  disabled={!comment}
                  onClick={handleAddNewComment}
                  sx={{
                    bgcolor: '#4F46E5',
                    height: '40px',
                    mt: 1
                  }}
                  variant='contained'
                >
                  Comment
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default IssueDetails
