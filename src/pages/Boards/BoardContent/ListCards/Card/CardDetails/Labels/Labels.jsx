import LabelPopover from '@/components/LabelPopover/LabelPopover'
import AddIcon from '@mui/icons-material/Add'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

const Labels = ({ card }) => {
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
      <Box sx={{ cursor: 'pointer' }}>
        <Typography variant='h6' sx={{ fontSize: '16px' }}>
          Labels
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {card?.label.map((label, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: `${label?.bgColor}`,
                height: '32px',
                p: '0 12px',
                borderRadius: ' 3px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {label.labelTitle}
            </Box>
          ))}
          <Box
            onClick={handleClick}
            sx={{
              height: '32px',
              borderRadius: ' 3px',
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#a1bdd914',
              p: 1
            }}
          >
            <AddIcon />
          </Box>
        </Box>
      </Box>
      <LabelPopover card={card} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Box>
  )
}

export default Labels
