import DatePopover from '@/components/DatePopover/DatePopover'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const DateTimes = ({ card }) => {
  const startDateTime = dayjs(card?.dateTime?.startDateTime)
  const dueDateTime = dayjs(card?.dateTime?.dueDateTime)

  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'dates-popover' : undefined

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
      <Box onClick={handleClick} sx={{ cursor: 'pointer' }}>
        <Typography variant='h6' sx={{ fontSize: '16px' }}>
          Dates
        </Typography>
        <Box
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
        </Box>
      </Box>
      <DatePopover card={card} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Box>
  )
}

export default DateTimes
