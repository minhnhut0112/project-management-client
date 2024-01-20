import { removeCoverAPI, updateCardAPI, updateCoverAPI } from '@/apis/cards.api'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import { Button, IconButton, ImageList, ImageListItem, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover'
import { styled } from '@mui/material/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
// import { toast } from 'react-toastify'

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

const CoverPopover = ({ card }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const [cover, setCover] = useState(null)

  useEffect(() => {
    setCover(card?.cover)
  }, [card?.cover])

  const queryClient = useQueryClient()

  const handleFileChange = async (e) => {
    const newFile = e.target.files[0]

    const formData = new FormData()
    formData.append('file', newFile)

    if (!newFile) return

    const res = await updateCoverAPI(card._id, formData)

    if (res) {
      setCover(res.cover)
      // toast.success('Update Cover is successfully!')
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  }

  const handleRemoveCover = async () => {
    const res = await removeCoverAPI(card._id)

    if (res) {
      // toast.success('Remove Cover is successfully!')
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  }

  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const selectedImageId = card?.attachment?.find((item) => item.path === cover)?._id
    setSelectedImage(selectedImageId)
  }, [cover, card?.attachment])

  const mutionUpdateCover = useMutation({
    mutationFn: async (data) => await updateCardAPI(card._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
      // toast.success('Update Cover is successfully!')
    }
  })

  const handleImageClick = (item) => {
    setSelectedImage(item._id)

    mutionUpdateCover.mutate({
      cover: item.path
    })
  }

  return (
    <Box>
      <Chip
        icon={<WallpaperIcon />}
        onClick={handleClick}
        onTouchStart={handleClick}
        sx={chipStyle}
        label='Cover'
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
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ marginLeft: '35px' }}></Box>
            <Typography sx={{ fontSize: '16px' }} variant='h6'>
              Cover
            </Typography>
            <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
              <ClearOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>

          {cover && (
            <>
              <Box sx={{ p: 1, border: 0.5, borderRadius: '5px', borderColor: '#e5e7eb', height: '150px' }}>
                <img
                  src={card.cover}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }}
                  alt='cover'
                />
              </Box>
              <Button
                onClick={handleRemoveCover}
                sx={{ color: 'black', bgcolor: '#f5f5f5', width: '100%', mt: 1, mb: 1 }}
              >
                Remove Cover
              </Button>
            </>
          )}

          <Typography variant='caption'>Attachments</Typography>

          <ImageList sx={{ width: '100%', mt: '5px', mb: '5px' }} cols={3} rowHeight={60}>
            {card?.attachment?.map((item) => {
              const isImageSelected = selectedImage === item._id

              if (item?.type?.includes('image')) {
                return (
                  <ImageListItem
                    key={item._id}
                    sx={{
                      bgcolor: isImageSelected ? 'black' : 'transparent',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: isImageSelected ? '2px solid #388BFF' : 'none'
                    }}
                    onClick={() => handleImageClick(item)}
                  >
                    <img
                      style={{
                        padding: 2,
                        borderRadius: '3px'
                      }}
                      srcSet={`${item.path}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.path}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.fileName}
                    />
                  </ImageListItem>
                )
              }
            })}
          </ImageList>

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
            <VisuallyHiddenInput accept='image/*' type='file' onChange={handleFileChange} />
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default CoverPopover
