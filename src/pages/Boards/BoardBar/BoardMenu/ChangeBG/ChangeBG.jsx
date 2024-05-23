import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Button, Typography } from '@mui/material'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import styled from '@emotion/styled'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBoardAPI, uploadCoverAPI } from '@/apis/boards.api'
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

const itemData = [
  {
    img: 'http://localhost:8017/uploads/bg1.jpg',
    title: 'bg1'
  },
  {
    img: 'http://localhost:8017/uploads/bg2.jpg',
    title: 'bg2'
  },
  {
    img: 'http://localhost:8017/uploads/bg3.jpg',
    title: 'bg3'
  },
  {
    img: 'http://localhost:8017/uploads/bg4.jpg',
    title: 'bg4'
  },
  {
    img: 'http://localhost:8017/uploads/bg5.jpg',
    title: 'bg5'
  },
  {
    img: 'http://localhost:8017/uploads/bg6.jpg',
    title: 'bg6'
  },
  {
    img: 'http://localhost:8017/uploads/bg7.jpg',
    title: 'bg7'
  },
  {
    img: 'http://localhost:8017/uploads/bg8.jpg',
    title: 'bg8'
  }
]

const ChangeBackground = ({ handleChangeContent, handleClose, board }) => {
  const mutionUpdateBoardCover = useMutation({
    mutationFn: (data) => updateBoardAPI(board._id, data)
  })

  const handleChangeBackGround = (imgSrc) => {
    mutionUpdateBoardCover.mutate({ cover: imgSrc })
  }

  const queryClient = useQueryClient()

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0]

    const formData = new FormData()
    formData.append('file', newFile)

    if (!newFile) return

    const res = await uploadCoverAPI(board._id, formData)

    if (res) {
      toast.success('Upload cover is successfully!')
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  }
  return (
    <Box sx={{ width: 340, p: 1, height: 'fit-content', mb: 1 }}>
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
          Change background
        </Typography>
        <IconButton onClick={handleClose} aria-label='delete'>
          <ClearOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>

      <Divider sx={{ m: 1 }} />

      <Typography sx={{ fontSize: '16px' }} variant='caption'>
        Photos
      </Typography>

      <ImageList sx={{ width: '100%', mt: '5px', mb: '5px', p: 0.25 }} cols={2} rowHeight={90} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              style={{ borderRadius: '5px' }}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              onClick={() => handleChangeBackGround(item.img)}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Divider sx={{ m: 1 }} />

      <Typography sx={{ fontSize: '16px' }} variant='caption'>
        Custom
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
        Upload background
        <VisuallyHiddenInput accept='image/*' type='file' onChange={handleFileChange} />
      </Button>
    </Box>
  )
}

export default ChangeBackground
