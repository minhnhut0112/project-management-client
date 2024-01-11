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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'dates-popover' : undefined

  return (
    <Box>
      <Chip
        icon={<LocalOfferOutlinedIcon />}
        onClick={handleClick}
        onTouchStart={handleClick}
        sx={chipStyle}
        label='Labels'
        clickable
        variant='outlined'
      />
      <LabelPopover card={card} id={id} open={open} anchorEl={anchorEl} handleClose={handleClose} />
    </Box>
  )
}

export default LabelChip
