import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateCardAPI } from '@/apis/cards.api'

const Description = ({ card }) => {
  const [openDescriptionForm, setOpenDescriptionForm] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    setDescription(card.description)
  }, [card.description])

  const handleChange = (e) => {
    setDescription(e.target.value)
  }

  useEffect(() => {
    const length = description?.length
    const input = document.getElementById('outlined-multiline-static')

    if (input) {
      input.setSelectionRange(length, length)
    }
  }, [description, openDescriptionForm])

  const queryClient = useQueryClient()

  const mutationUpdateDescription = useMutation({
    mutationFn: (data) => updateCardAPI(card._id, data)
  })

  const handleUpdateDescription = () => {
    if (!description) {
      setOpenDescriptionForm(false)
      return
    }

    mutationUpdateDescription.mutate(
      {
        description: description
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['board'] })
          toast.success('Updated description is successful!')
        }
      }
    )
    setOpenDescriptionForm(false)
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 0.75 }}>
          <ViewHeadlineOutlinedIcon />
          <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Description
          </Typography>
        </Box>
        {!openDescriptionForm && description && (
          <Chip
            sx={{
              fontSize: '15px',
              justifyContent: 'start',
              borderRadius: '4px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
              border: 'none'
            }}
            onClick={() => setOpenDescriptionForm(true)}
            label='Edit'
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
        {!description || openDescriptionForm ? (
          <Box sx={{ width: '100%' }}>
            {!openDescriptionForm ? (
              <Chip
                onClick={() => setOpenDescriptionForm(true)}
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
                  value={description}
                  sx={{ mt: 1, width: '100%', mb: 1 }}
                  placeholder='Add a more detailed description…'
                  onChange={handleChange}
                  multiline
                  rows={4}
                  maxRows={4}
                  inputProps={{ style: { cursor: 'auto' } }}
                />
                <Button onClick={handleUpdateDescription} variant='contained' sx={{ mx: 1 }}>
                  Save
                </Button>
                <Button onClick={() => setOpenDescriptionForm(false)} variant='text'>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography onClick={() => setOpenDescriptionForm(true)} sx={{ fontSize: '16px' }}>
            {description}
          </Typography>
        )}
      </Box>
    </>
  )
}

export default Description
