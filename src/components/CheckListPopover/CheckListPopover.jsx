import { createChecklistAPI } from '@/apis/cards.api'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Button, IconButton, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const CheckListPopover = ({ anchorEl, handleClose, card, id, open }) => {
  const [checklistTitle, setCheckListTitle] = useState('')

  const queryClient = useQueryClient()

  const mutionCreateCheckList = useMutation({
    mutationFn: async (data) => {
      const res = await createChecklistAPI(card?._id, data)
      return res.data
    },
    onSuccess: () => {
      handleClose()
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const handleCreateCheclist = () => {
    mutionCreateCheckList.mutate({
      checklistTitle: checklistTitle
    })
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
        vertical: 'bottom',
        horizontal: 'left'
      }}
      sx={{ mx: 2, marginBottom: 10 }}
    >
      <Box
        sx={{
          p: 2,
          width: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#ebecf0')
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ marginLeft: '15px' }}></Box>
          <Typography sx={{ fontSize: '16px' }} variant='h6'>
            CheckList
          </Typography>
          <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
            <ClearOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>

        <Typography variant='body'>Title</Typography>

        <TextField
          sx={{ mt: 1, mb: 1 }}
          fullWidth
          size='small'
          autoFocus
          onChange={(e) => setCheckListTitle(e.target.value)}
        />

        <Button
          onClick={handleCreateCheclist}
          sx={{
            bgcolor: '#4F46E5',
            width: '100%'
          }}
          variant='contained'
          disableElevation
        >
          Add
        </Button>
      </Box>
    </Popover>
  )
}

export default CheckListPopover
