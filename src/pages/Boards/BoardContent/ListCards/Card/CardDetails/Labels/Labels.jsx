import LabelPopover from '@/components/LabelPopover/LabelPopover'
import { isColorLight } from '@/utils/formatters'
import AddIcon from '@mui/icons-material/Add'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'

const Labels = ({ card }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [labels, setLabels] = useState([])

  useEffect(() => {
    setLabels(card?.labels)
  }, [card])

  const handlePopoverChange = (updatedLabels) => {
    setLabels(updatedLabels)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
      <Box sx={{ cursor: 'pointer' }}>
        <Typography variant='h6' sx={{ fontSize: '16px' }}>
          Labels
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {labels.map((label, index) => (
            <Box
              key={index}
              sx={{
                minWidth: '70px',
                bgcolor: `${label?.bgColor}`,
                height: '32px',
                p: '0 12px',
                borderRadius: ' 3px',
                display: 'flex',
                alignItems: 'center',
                color: isColorLight(label.bgColor) ? 'black' : 'white'
              }}
            >
              {label.labelTitle}
            </Box>
          ))}
          <Box
            onClick={(event) => {
              setAnchorEl(event.currentTarget)
            }}
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
      <LabelPopover
        card={card}
        id={Boolean(anchorEl) ? 'dates-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={() => {
          setAnchorEl(null)
        }}
        onPopoverChange={handlePopoverChange}
      />
    </Box>
  )
}

export default Labels
