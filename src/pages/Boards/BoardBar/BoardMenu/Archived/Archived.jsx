import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

const Archive = ({ handleChangeContent, handleClose }) => {
  return (
    <Box sx={{ width: 280, p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          onClick={() => {
            handleChangeContent('menu')
          }}
          aria-label='delete'
        >
          <ArrowBackIosIcon fontSize='small' sx={{ fontSize: '14px' }} />
        </IconButton>
        <Typography sx={{ fontSize: '16px' }} variant='h6'>
          Archive
        </Typography>
        <IconButton onClick={handleClose} aria-label='delete'>
          <ClearOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>

      <Divider sx={{ m: 1 }} />

      <Box>Archive</Box>
    </Box>
  )
}

export default Archive
