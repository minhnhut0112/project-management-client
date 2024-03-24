import DatePopover from '@/components/DatePopover/DatePopover'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Checkbox } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCardAPI } from '@/apis/cards.api'

const DateTimes = ({ card }) => {
  const startDateTime = dayjs(card?.dateTime?.startDateTime)
  const dueDateTime = dayjs(card?.dateTime?.dueDateTime)

  const currentDateTime = dayjs()

  const isOverdue = currentDateTime.isAfter(dueDateTime)
  const isComplete = card?.completed

  let status = ''
  let bgColor = ''
  if (isComplete) {
    status = 'Complete'
    bgColor = '#1f845a'
  } else if (isOverdue) {
    status = 'Overdue'
    bgColor = '#ffeceb'
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'dates-popover' : undefined

  const queryClient = useQueryClient()

  const mutionUpdateCardStatus = useMutation({
    mutationFn: async (data) => {
      const res = await updateCardAPI(card?._id, data)
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const updateCardStatus = () => {
    mutionUpdateCardStatus.mutate({ completed: !card?.completed })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
      <Box sx={{ cursor: 'pointer' }}>
        <Typography variant='h6' sx={{ fontSize: '16px' }}>
          Dates
        </Typography>
        <Box
          sx={{
            display: 'flex'
          }}
        >
          <Checkbox checked={card?.completed} onChange={updateCardStatus} />
          <Box
            onClick={handleClick}
            sx={{
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
              p: 0.5,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography>
              {dayjs(startDateTime).format('MMM D, YYYY [at] h:mm A')} -{'  '}
              {dayjs(dueDateTime).format('MMM D, YYYY [at] h:mm A')}
            </Typography>
            <ExpandMoreIcon fontSize='small' />
            <Box sx={{ bgcolor: bgColor, mt: 0.5, mb: 0.5, p: '0 4px', borderRadius: '2px' }}>
              <Typography
                variant='caption'
                sx={{ fontSize: '12px', color: isComplete ? 'white' : '#ae2e24', lineHeight: '16px' }}
              >
                {status}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <DatePopover card={card} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Box>
  )
}

export default DateTimes
