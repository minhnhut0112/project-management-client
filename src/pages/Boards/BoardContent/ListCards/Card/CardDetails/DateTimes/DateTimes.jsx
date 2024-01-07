import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const DateTimes = ({ card }) => {
  const [startDateTime, setStartDateTime] = useState(null)
  const [dueDateTime, setDueDateTime] = useState(null)

  useEffect(() => {
    if (card?.dateTime) {
      setStartDateTime(dayjs(card?.dateTime?.startDateTime))
      setDueDateTime(dayjs(card?.dateTime?.dueDateTime))
    }
  }, [card])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
      <Box>
        <Typography variant='caption'>Estimated completion time</Typography>
        <Box>
          {dayjs(startDateTime).format('MMM D, YYYY [at] h:mm A')} -{' '}
          {dayjs(dueDateTime).format('MMM D, YYYY [at] h:mm A')}
        </Box>
      </Box>
    </Box>
  )
}

export default DateTimes
