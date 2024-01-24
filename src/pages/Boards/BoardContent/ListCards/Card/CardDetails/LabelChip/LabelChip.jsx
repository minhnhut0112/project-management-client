import LabelPopover from '@/components/LabelPopover/LabelPopover'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useState } from 'react'

const chipStyle = {
  fontSize: '15px',
  justifyContent: 'start',
  borderRadius: '4px',
  width: '100%',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
  border: 'none'
}

const LabelChip = ({ card }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <Box>
      <Chip
        icon={<LocalOfferOutlinedIcon />}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
        }}
        onTouchStart={(event) => {
          setAnchorEl(event.currentTarget)
        }}
        sx={chipStyle}
        label='Labels'
        clickable
        variant='outlined'
      />

      <LabelPopover
        card={card}
        id={Boolean(anchorEl) ? 'dates-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={() => {
          setAnchorEl(null)
        }}
      />
    </Box>
  )
}

export default LabelChip
