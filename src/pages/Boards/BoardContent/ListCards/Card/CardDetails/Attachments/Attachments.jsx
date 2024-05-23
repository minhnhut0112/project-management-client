import { removeAttachmentsAPI, removeCoverAPI, updateCardAPI } from '@/apis/cards.api'
import AttachmentsPopover from '@/components/AttachmentsPopover/AttachmentsPopover'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'
import { getFileExtension } from '@/utils/formatters'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import { Avatar, Box, Chip, Skeleton, Typography } from '@mui/material'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const SkeletonBox = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
    <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
    <Skeleton variant='rectangular' width='100%' height={80} />
  </Box>
)

const Attachments = ({ card }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'attachments-popover' : undefined

  const user = useSelector((state) => state.user.auth)

  const [fileTimes, setFileTimes] = useState({})
  const [isTimeCalculated, setIsTimeCalculated] = useState(false)
  const [attachments, setAttachments] = useState([])

  useEffect(() => {
    if (card.attachments) {
      setAttachments(card.attachments)
    }
  }, [card.attachments])

  const queryClient = useQueryClient()

  useEffect(() => {
    const interval = setInterval(() => {
      const newFileTimes = {}
      card?.attachments.forEach((att) => {
        newFileTimes[att._id] = calculateTimeFromNow(att.createAt)
      })
      setFileTimes(newFileTimes)
      setIsTimeCalculated(true)
    }, 1000)

    return () => clearInterval(interval)
  }, [card?.attachments])

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

  const mutionRemoveFile = useMutation({
    mutationFn: (data) => removeAttachmentsAPI(card?._id, data, user.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const [anchorElDelete, setAnchorElDelete] = useState(null)

  const handleConfirm = (att) => {
    setOpenCf(false)
    mutionRemoveFile.mutate({
      attachment: att
    })
    if (card?.cover === att.path) {
      mutionRemoveCover.mutate()
    }
  }

  const mutionMakeCover = useMutation({
    mutationFn: async (data) => await updateCardAPI(card._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
    }
  })

  const handleMakeCover = (path) => {
    mutionMakeCover.mutate({
      cover: path
    })
  }

  const mutionRemoveCover = useMutation({
    mutationFn: async () => await removeCoverAPI(card._id, user.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
    }
  })

  const handleRemoveCover = () => {
    mutionRemoveCover.mutate()
  }

  const [opencf, setOpenCf] = useState(false)

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
          onClick={handleClick}
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
        <AttachmentsPopover card={card} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} />
      </Box>
      {isTimeCalculated ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
            {attachments?.slice(0, showAll ? attachments.length : 3).map((att) => {
              if (att?.type?.includes('image')) {
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
                    <Box sx={{ width: '100%' }}>
                      <Typography
                        onClick={(e) => {
                          e.preventDefault()
                          handleDownload(att.path, att.fileName)
                        }}
                        variant='body'
                        sx={{ fontWeight: 'bold' }}
                      >
                        {decodeURIComponent(att.fileName)}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant='caption' sx={{ fontSize: '14px' }}>
                          {fileTimes[att._id]}
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{ fontSize: '14px' }}
                          onClick={(event) => {
                            setAnchorElDelete(event.currentTarget)
                            setOpenCf(att._id)
                          }}
                        >
                          • Delete
                        </Typography>
                        {att._id == opencf && (
                          <ConfirmationPopover
                            id={Boolean(anchorElDelete) ? 'attachments-delete' : undefined}
                            title='Delete attachment?'
                            description='Deleting an attachment is permanent. There is no undo.'
                            open={Boolean(anchorElDelete)}
                            anchorEl={anchorElDelete}
                            handleClose={() => {
                              setAnchorElDelete(null)
                            }}
                            onConfirm={handleConfirm}
                            confirmArgs={att}
                          />
                        )}
                      </Box>

                      {card?.cover === att.path ? (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: 'fit-content' }}
                          onClick={handleRemoveCover}
                        >
                          <WallpaperIcon fontSize='16px' />
                          <Typography variant='caption' sx={{ fontSize: '14px', textDecoration: 'underline' }}>
                            Remove Cover
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          onClick={() => handleMakeCover(att?.path)}
                        >
                          <WallpaperIcon fontSize='16px' />
                          <Typography variant='caption' sx={{ fontSize: '14px', textDecoration: 'underline' }}>
                            Make Cover
                          </Typography>
                        </Box>
                      )}
                    </Box>
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
                    <Box sx={{ width: '100%' }}>
                      <Typography
                        onClick={(e) => {
                          e.preventDefault()
                          handleDownload(att.path, att.fileName)
                        }}
                        variant='body'
                        sx={{ fontWeight: 'bold' }}
                      >
                        {decodeURIComponent(att.fileName)}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant='caption' sx={{ fontSize: '14px' }}>
                          {fileTimes[att._id]}
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{ fontSize: '14px' }}
                          onClick={(event) => {
                            setAnchorElDelete(event.currentTarget)
                            setOpenCf(att._id)
                          }}
                        >
                          • Delete
                        </Typography>
                        {att._id == opencf && (
                          <ConfirmationPopover
                            id={Boolean(anchorElDelete) ? 'attachments-delete' : undefined}
                            title='Delete attachment?'
                            description='Deleting an attachment is permanent. There is no undo.'
                            open={Boolean(anchorElDelete)}
                            anchorEl={anchorElDelete}
                            handleClose={() => {
                              setAnchorElDelete(null)
                            }}
                            onConfirm={handleConfirm}
                            confirmArgs={att}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                )
              }
            })}
            {attachments.length > 3 && (
              <Chip
                onClick={toggleShowAll}
                label={showAll ? 'Show Fewer' : `Show All ( ${attachments.length - 3} hidden)`}
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
          {Array.from({ length: Math.min(3, attachments.length) }, (_, index) => (
            <SkeletonBox key={index} />
          ))}
        </Box>
      )}
    </>
  )
}

export default Attachments
