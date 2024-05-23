import { uploadAttachmentsAPI } from '@/apis/cards.api'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import { styled } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

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

const AttachmentsPopover = ({ anchorEl, handleClose, card, id, open }) => {
  const queryClient = useQueryClient()

  const user = useSelector((state) => state.user.auth)

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0]

    const formData = new FormData()
    formData.append('file', newFile)

    if (!newFile) {
      handleClose()
      return
    }

    const res = await uploadAttachmentsAPI(card._id, formData, user.accessToken)

    if (res) {
      handleClose()
      toast.success('Upload attachment is successfully!')
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  }

  return (
    <Popover
      data-no-dnd
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

        <Typography variant='caption' sx={{ fontSize: '13px' }}>
          Attach a file from your computer
        </Typography>

        <Button
          component='label'
          variant='contained'
          sx={{
            bgcolor: '#4F46E5',
            width: '100%',
            mt: 1
          }}
          startIcon={<CloudUploadIcon />}
        >
          Choose a file
          <VisuallyHiddenInput
            accept='.jpg, .jpeg, .png, .webp, .gif, .pdf, .doc, .docx, .xls, .xlsx, .txt'
            type='file'
            onChange={handleFileChange}
          />
        </Button>
      </Box>
    </Popover>
  )
}

export default AttachmentsPopover
