import { uploadAttachmentsAPI } from '@/apis/cards.api'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const chipStyle = {
  fontSize: '15px',
  justifyContent: 'start',
  borderRadius: '4px',
  width: '100%',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
  border: 'none'
}

const AttachmentsPopover = ({ card }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'attachments-popover' : undefined

  const queryClient = useQueryClient()

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0]

    const formData = new FormData()
    formData.append('file', newFile)

    if (!newFile) return

    const res = await uploadAttachmentsAPI(card._id, formData)

    if (res) {
      toast.success('Upload attachment is successfully!')
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  }

  return (
    <Box>
      <Chip
        icon={<AttachmentOutlinedIcon />}
        onClick={handleClick}
        onTouchStart={handleClick}
        sx={chipStyle}
        label='Attachments'
        clickable
        variant='outlined'
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        sx={{ mx: 2 }}
      >
        <Box
          sx={{
            width: 300,
            height: 350,
            p: 2,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#ebecf0')
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ marginLeft: '35px' }}></Box>
            <Typography sx={{ fontSize: '16px' }} variant='h6'>
              Attachments
            </Typography>
            <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
              <ClearOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>

          <Typography variant='caption' sx={{ fontSize: '16px' }}>
            Attach a file from your computer
          </Typography>

          <Button
            component='label'
            variant='contained'
            sx={{
              width: '100%',
              color: 'black',
              bgcolor: '#f5f5f5',
              boxShadow: 'none',
              mt: 1,
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              accept='.jpg, .jpeg, .png, .webp, .gif, .pdf, .doc, .docx, .xls, .xlsx, .txt'
              type='file'
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default AttachmentsPopover
