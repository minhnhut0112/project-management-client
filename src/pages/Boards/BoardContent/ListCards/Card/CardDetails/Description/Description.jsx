import { updateCardAPI } from '@/apis/cards.api'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined'
import { Button, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Description = ({ card }) => {
  const [openDesciptionForm, setOpenDesciptionForm] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    setDescription(card.description)
  }, [card.description])

  const mutionUpdateDescription = useMutation({
    mutationFn: (data) => updateCardAPI(card._id, data)
  })

  const handleUpdateDescription = () => {
    if (!description) {
      setOpenDesciptionForm(false)
      return
    }

    mutionUpdateDescription.mutate(
      {
        description: description
      },
      {
        onSuccess: () => {
          toast.success('Updated desciption is successfully!')
        }
      }
    )
    setOpenDesciptionForm(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewHeadlineOutlinedIcon />
          <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Desciption
          </Typography>
        </Box>
        {!openDesciptionForm && description && (
          <Chip
            sx={{
              fontSize: '15px',
              justifyContent: 'start',
              borderRadius: '4px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
              border: 'none'
            }}
            onClick={() => setOpenDesciptionForm(true)}
            label='Edit'
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
        {!description || openDesciptionForm ? (
          <Box sx={{ width: '100%' }}>
            {!openDesciptionForm ? (
              <Chip
                onClick={() => setOpenDesciptionForm(true)}
                sx={{
                  borderRadius: '4px',
                  width: '100%',
                  justifyContent: 'start',
                  alignItems: 'start',
                  p: '5px 5px 0 0',
                  height: '50px',
                  mt: 1
                }}
                label='Add a more detailed description…'
                clickable
                variant='outlined'
              />
            ) : (
              <Box sx={{ mt: 1, width: '100%' }}>
                <TextField
                  autoComplete='false'
                  id='outlined-multiline-static'
                  autoFocus
                  defaultValue={description}
                  sx={{ mt: 1, width: '100%', mb: 1 }}
                  multiline
                  rows={4}
                  placeholder='Add a more detailed description…'
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button onClick={handleUpdateDescription} variant='contained' sx={{ mx: 1 }}>
                  Save
                </Button>
                <Button onClick={() => setOpenDesciptionForm(false)} variant='text'>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography sx={{ fontSize: '16px' }}>{description}</Typography>
        )}
      </Box>
    </>
  )
}

export default Description
