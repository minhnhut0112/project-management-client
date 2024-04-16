import { createNewLabelAPI, editLabelAPI, removeLabelAPI } from '@/apis/boards.api'
import { initLabelColor } from '@/utils/constants'
import { isColorLight } from '@/utils/formatters'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Button, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const Labels = ({ handleChangeContent, handleClose, board }) => {
  const [labels, setLabels] = useState([])
  const [mode, setMode] = useState('select')
  const [selectedLabel, setSelectedLabel] = useState({ _id: '', labelTitle: '', bgColor: '' })
  const [newLabel, setNewLabel] = useState({ _id: '', labelTitle: '', bgColor: initLabelColor[0] })
  const [checkedColor, setCheckedColor] = useState('')
  const [visibleLabels, setVisibleLabels] = useState(7)

  useEffect(() => {
    setLabels(board.labels)
  }, [board.labels])

  const queryClient = useQueryClient()

  const mutionSaveEditLabel = useMutation({
    mutationFn: async (label) => {
      const res = await editLabelAPI(board._id, label)
      return res
    },
    onSuccess: async (data) => {
      setLabels(data?.labels)
      setMode('select')
      await queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const handleSaveEditLabel = async () => {
    if (!selectedLabel) return

    mutionSaveEditLabel.mutate({ labelEdited: selectedLabel })
  }

  const mutionAddNewLabel = useMutation({
    mutationFn: async (label) => {
      const res = await createNewLabelAPI(board._id, label)
      return res
    },
    onSuccess: async (data) => {
      setLabels(data?.labels)
      setNewLabel({ _id: '', labelTitle: '', bgColor: initLabelColor[0] })
      setMode('select')
      await queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const handleAddNewLabel = () => {
    if (!newLabel) return
    mutionAddNewLabel.mutate({ ...newLabel })
  }

  const mutionRemoveLabel = useMutation({
    mutationFn: async (labelId) => {
      const res = await removeLabelAPI(board._id, labelId.labelId)
      return res
    },
    onSuccess: () => {
      setMode('select')
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const handleRemoveLabel = (labelId) => {
    if (!selectedLabel) return
    mutionRemoveLabel.mutate({ labelId })
  }

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
          Labels
        </Typography>
        <IconButton onClick={handleClose} aria-label='delete'>
          <ClearOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>

      <Divider sx={{ m: 1 }} />

      {mode === 'select' && (
        <Box sx={{ p: 1 }}>
          <TextField autoFocus size='small' fullWidth placeholder='Search Labels...' />
          <Box sx={{ mt: 1 }}>
            <Typography variant='caption' sx={{ fontSize: '16px' }}>
              Labels
            </Typography>

            <Box sx={{ mt: 1 }}>
              {labels?.slice(0, visibleLabels).map((label) => (
                <Box key={label._id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      bgcolor: label.bgColor,
                      width: '100%',
                      height: '30px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      pl: 1,
                      mr: 1,
                      color: isColorLight(label?.bgColor) ? 'black' : 'white'
                    }}
                  >
                    {label.labelTitle}
                  </Box>
                  <EditOutlinedIcon
                    fontSize='small'
                    onClick={() => {
                      setMode('edit')
                      setSelectedLabel(label)
                      setCheckedColor(label.bgColor)
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Button
              onClick={() => {
                setMode('add')
                setNewLabel({ _id: '', labelTitle: '', bgColor: initLabelColor[0] })
              }}
              sx={{
                color: '#172b4d',
                bgcolor: '#091e420f',
                width: '100%',
                mt: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: '#091e420f'
                }
              }}
              variant='contained'
              disableElevation
            >
              Create a new label
            </Button>
            {visibleLabels < labels?.length && (
              <Button
                onClick={() => setVisibleLabels(labels?.length)}
                sx={{
                  color: '#172b4d',
                  bgcolor: '#091e420f',
                  width: '100%',
                  '&:hover': {
                    bgcolor: '#091e420f'
                  }
                }}
                variant='contained'
                disableElevation
              >
                Show more labels
              </Button>
            )}
          </Box>
        </Box>
      )}

      {mode === 'edit' && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <IconButton aria-label='delete' sx={{ color: 'transparent' }}>
              <ArrowBackIosIcon fontSize='small' sx={{ fontSize: '14px' }} />
            </IconButton>
            <Typography sx={{ fontSize: '16px' }} variant='h6'>
              Edit label
            </Typography>
            <IconButton
              onClick={() => {
                setMode('select')
              }}
              aria-label='delete'
            >
              <ClearOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box sx={{ mt: 0.5, mb: 0.5, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                bgcolor: selectedLabel?.bgColor,
                width: '80%',
                height: '35px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                pl: 1,
                mr: 1,
                color: isColorLight(selectedLabel?.bgColor) ? 'black' : 'white'
              }}
            >
              {selectedLabel.labelTitle}
            </Box>
          </Box>
          <Typography variant='caption'>Title</Typography>
          <TextField
            autoFocus
            sx={{ mt: 0.5, mb: 0.5 }}
            size='small'
            fullWidth
            value={selectedLabel?.labelTitle}
            onChange={(e) => setSelectedLabel((prevLabel) => ({ ...prevLabel, labelTitle: e.target.value }))}
          />
          <Typography variant='caption'>Select a color</Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {initLabelColor?.map((color, index) => (
              <Box
                key={index}
                onClick={() => {
                  setCheckedColor(color)
                  setSelectedLabel((prevLabel) => ({ ...prevLabel, bgColor: color }))
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '3px',
                  width: '60px',
                  height: '32px',
                  border: checkedColor === color ? '2px solid #388BFF' : 'none'
                }}
              >
                <Box sx={{ borderRadius: '3px', bgcolor: color, width: '55px', height: '26px' }}></Box>
              </Box>
            ))}
          </Box>
          <Button
            onClick={() => setSelectedLabel((prevLabel) => ({ ...prevLabel, bgColor: '#f5f5f5' }))}
            sx={{
              color: '#172b4d',
              bgcolor: '#091e420f',
              width: '100%',
              mt: 1,
              mb: 1,
              '&:hover': {
                bgcolor: '#091e420f'
              }
            }}
            variant='contained'
            disableElevation
          >
            <ClearOutlinedIcon fontSize='small' /> Remove color
          </Button>
          <hr />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleSaveEditLabel}
              sx={{
                color: '#fff',
                bgcolor: '#0c66e4',
                '&:hover': {
                  bgcolor: '#0c66e4'
                }
              }}
              variant='contained'
              disableElevation
            >
              Save
            </Button>
            <Button
              onClick={() => handleRemoveLabel(selectedLabel?._id)}
              sx={{
                color: '#fff',
                bgcolor: '#c9372c',
                '&:hover': {
                  bgcolor: '#c9372c'
                }
              }}
              variant='contained'
              disableElevation
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}

      {mode === 'add' && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <IconButton aria-label='add' sx={{ color: 'transparent' }}>
              <ArrowBackIosIcon fontSize='small' sx={{ fontSize: '14px' }} />
            </IconButton>
            <Typography sx={{ fontSize: '16px' }} variant='h6'>
              Create label
            </Typography>
            <IconButton
              sx={{ p: 0 }}
              onClick={() => {
                setMode('select')
                setNewLabel({ _id: '', labelTitle: '', bgColor: initLabelColor[0] })
              }}
              aria-label='delete'
            >
              <ClearOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box sx={{ mt: 0.5, mb: 0.5, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                bgcolor: newLabel?.bgColor,
                width: '80%',
                height: '35px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                pl: 1,
                mr: 1
              }}
            >
              {newLabel?.labelTitle}
            </Box>
          </Box>
          <Typography variant='caption'>Title</Typography>
          <TextField
            autoFocus
            sx={{ mt: 0.5, mb: 0.5 }}
            size='small'
            fullWidth
            value={newLabel?.labelTitle}
            onChange={(e) => setNewLabel((prevLabel) => ({ ...prevLabel, labelTitle: e.target.value }))}
          />
          <Typography variant='caption'>Select a color</Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {initLabelColor?.map((color, index) => (
              <Box
                key={index}
                onClick={() => {
                  setCheckedColor(color)
                  setNewLabel((prevLabel) => ({ ...prevLabel, bgColor: color }))
                }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '3px',
                  width: '60px',
                  height: '32px',
                  border: color === newLabel?.bgColor ? '2px solid #388BFF' : 'none'
                }}
              >
                <Box sx={{ borderRadius: '3px', bgcolor: color, width: '55px', height: '26px' }}></Box>
              </Box>
            ))}
          </Box>
          <Button
            onClick={() => setNewLabel((prevLabel) => ({ ...prevLabel, bgColor: '#f5f5f5' }))}
            sx={{
              color: '#172b4d',
              bgcolor: '#091e420f',
              width: '100%',
              mt: 1,
              mb: 1,
              '&:hover': {
                bgcolor: '#091e420f'
              }
            }}
            variant='contained'
            disableElevation
          >
            <ClearOutlinedIcon fontSize='small' /> Remove color
          </Button>
          <hr />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleAddNewLabel}
              sx={{
                color: '#fff',
                bgcolor: '#0c66e4',
                '&:hover': {
                  bgcolor: '#0c66e4'
                }
              }}
              variant='contained'
              disableElevation
            >
              Create
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Labels
