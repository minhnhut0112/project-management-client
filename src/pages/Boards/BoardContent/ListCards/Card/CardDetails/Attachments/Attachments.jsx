import { useState, useEffect } from 'react'
import { Box, Avatar, Typography, Chip, Skeleton } from '@mui/material'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import moment from 'moment'
import axios from 'axios'
import { getFileExtension } from '@/utils/formatters'

const SkeletonBox = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
    <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
    <Skeleton variant='rectangular' width='100%' height={80} />
  </Box>
)

const Attachments = ({ attachment }) => {
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
                    onClick={(e) => {
                      e.preventDefault()
                      handleDownload(att.path, att.fileName)
                    }}
                  >
                    <Avatar
                      sx={{ width: '120px', height: '80px', borderRadius: '3px' }}
                      src={att.path}
                      variant='square'
                    >
                      N
                    </Avatar>
                    <div>
                      <Typography>{decodeURIComponent(att.fileName)}</Typography>
                      <Typography variant='caption'>{fileTimes[att._id]}</Typography>
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
                    onClick={(e) => {
                      e.preventDefault()
                      handleDownload(att.path, att.fileName)
                    }}
                  >
                    <Avatar
                      sx={{ width: '120px', height: '80px', bgcolor: '#091e420f', borderRadius: '3px' }}
                      src={att.path}
                      variant='square'
                    >
                      {getFileExtension(att.fileName)}
                    </Avatar>
                    <div>
                      <Typography>{decodeURIComponent(att.fileName)}</Typography>
                      <Typography variant='caption'>{fileTimes[att._id]}</Typography>
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
