import { removeAttachmentsAPI } from '@/apis/cards.api'
import { getFileExtension } from '@/utils/formatters'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useConfirm } from 'material-ui-confirm'
import moment from 'moment'
import { useEffect, useState } from 'react'

const SkeletonBox = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
    <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
    <Skeleton variant='rectangular' width='100%' height={80} />
  </Box>
)

const Attachments = ({ attachment, cardId }) => {
  const [fileTimes, setFileTimes] = useState({})
  const [isTimeCalculated, setIsTimeCalculated] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newFileTimes = {}
      attachment.forEach((att) => {
        newFileTimes[att._id] = calculateTimeFromNow(att.createAt)
      })
      setFileTimes(newFileTimes)
      setIsTimeCalculated(true)
    }, 1000)

    return () => clearInterval(interval)
  }, [attachment])

  const calculateTimeFromNow = (createdAt) => {
    const currentTime = moment()
    const attachmentTime = moment(createdAt)
    const duration = moment.duration(currentTime.diff(attachmentTime))

    const days = Math.floor(duration.asDays())
    const hours = duration.hours()
    const minutes = duration.minutes()

    if (days > 0) {
      if (days === 1) {
        return 'Added yesterday'
      } else {
        return moment(createdAt).format('DD/MM/YYYY')
      }
    } else if (hours > 0) {
      return `Added ${hours} hours ago`
    } else if (minutes > 0) {
      return `Added ${minutes} minute ago`
    } else {
      return 'Added just now'
    }
  }

  const handleDownload = async (path, fileName) => {
    const response = await axios.get(path, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURIComponent(fileName))
    document.body.appendChild(link)
    link.click()
  }

  const [showAll, setShowAll] = useState(false)

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const queryClient = useQueryClient()

  const mutionRemoveFile = useMutation({
    mutationFn: (data) => removeAttachmentsAPI(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      // toast.success('Edit Column Title is successfully!')
    }
  })

  const confirm = useConfirm()

  const handleRemoveFile = (att) => {
    confirm({
      title: 'Remove attachment?',
      description: 'Deleting an attachment is permanent. There is no undo.',
      confirmationText: 'Confirm',
      dialogProps: { maxWidth: 'xs' },
      confirmationButtonProps: { color: 'warning' }
    })
      .then(() => {
        mutionRemoveFile.mutate({
          attachment: att
        })
      })
      .catch(() => {})
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          mb: 1
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 0.75 }}>
          <AttachmentOutlinedIcon />
          <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Attachment
          </Typography>
        </Box>
        <Chip
          clickable
          sx={{
            fontSize: '15px',
            justifyContent: 'start',
            borderRadius: '4px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
            border: 'none'
          }}
          label='Add'
        />
      </Box>
      {isTimeCalculated ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
            {attachment.slice(0, showAll ? attachment.length : 4).map((att) => {
              if (att.type.includes('image')) {
                return (
                  <Box
                    key={att._id}
                    sx={{
                      p: 0.5,
                      display: 'flex',
                      gap: 2,
                      '&:hover': {
                        bgcolor: '#091e420f'
                      },
                      cursor: 'pointer',
                      borderRadius: '5px'
                    }}
                  >
                    <Avatar
                      onClick={(e) => {
                        e.preventDefault()
                        handleDownload(att.path, att.fileName)
                      }}
                      sx={{ width: '120px', height: '80px', borderRadius: '3px' }}
                      src={att.path}
                      variant='square'
                    >
                      N
                    </Avatar>
                    <div>
                      <Typography>{decodeURIComponent(att.fileName)}</Typography>
                      <Box>
                        <Typography variant='caption' sx={{ mr: 1 }}>
                          {fileTimes[att._id]}
                        </Typography>
                      </Box>
                      <Box variant='caption' onClick={() => handleRemoveFile(att)}>
                        Remove
                      </Box>
                    </div>
                  </Box>
                )
              } else {
                return (
                  <Box
                    key={att._id}
                    sx={{
                      p: 0.5,
                      display: 'flex',
                      gap: 2,
                      '&:hover': {
                        bgcolor: '#091e420f'
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <Avatar
                      onClick={(e) => {
                        e.preventDefault()
                        handleDownload(att.path, att.fileName)
                      }}
                      sx={{ width: '120px', height: '80px', bgcolor: '#091e420f', borderRadius: '3px' }}
                      src={att.path}
                      variant='square'
                    >
                      {getFileExtension(att.fileName)}
                    </Avatar>
                    <div>
                      <Typography>{decodeURIComponent(att.fileName)}</Typography>
                      <Typography variant='caption'>{fileTimes[att._id]}</Typography>
                      <Box variant='caption' onClick={() => handleRemoveFile(att)}>
                        Remove
                      </Box>
                    </div>
                  </Box>
                )
              }
            })}
            {attachment.length > 4 && (
              <Chip
                onClick={toggleShowAll}
                label={showAll ? 'Show Fewer' : `Show All ( ${attachment.length - 4} hidden)`}
                clickable
                variant='outlined'
                sx={{
                  ml: 0.5,
                  fontSize: '15px',
                  justifyContent: 'start',
                  borderRadius: '4px',
                  width: 'fit-content',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
                  border: 'none'
                }}
              />
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          {Array.from({ length: Math.min(4, attachment.length) }, (_, index) => (
            <SkeletonBox key={index} />
          ))}
        </Box>
      )}
    </>
  )
}

export default Attachments
