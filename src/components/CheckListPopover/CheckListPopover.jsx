import { createChecklistAPI } from '@/apis/cards.api'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Button, IconButton, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const CheckListPopover = ({ anchorEl, handleClose, card, id, open }) => {
  const [checklistTitle, setCheckListTitle] = useState('')

  const queryClient = useQueryClient()

  const user = useSelector((state) => state.user.auth)

  const mutionCreateCheckList = useMutation({
    mutationFn: async (data) => {
      const res = await createChecklistAPI(card?._id, data, user.accessToken)
      return res.data
    },
    onSuccess: () => {
      handleClose()
      queryClient.invalidateQueries({ queryKey: ['board'] })
    }
  })

  const handleCreateCheclist = () => {
    if (!checklistTitle) {
      handleClose()
      return
    }

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
      onClose={() => {
        handleClose()
        setCheckListTitle('')
      }}
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
            Add checklist
          </Typography>
          <IconButton
            sx={{ p: 0 }}
            onClick={() => {
              handleClose()
              setCheckListTitle('')
            }}
            aria-label='delete'
          >
            <ClearOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>

        <Typography variant='body'>Title</Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleCreateCheclist()
          }}
        >
          <TextField
            sx={{ mt: 1, mb: 1 }}
            fullWidth
            size='small'
            autoFocus
            value={checklistTitle}
            onChange={(e) => setCheckListTitle(e.target.value)}
          />

          <Button
            disabled={!checklistTitle}
            type='submit'
            sx={{
              bgcolor: '#4F46E5',
              width: '100%'
            }}
            variant='contained'
          >
            Add
          </Button>
        </form>
      </Box>
    </Popover>
  )
}

export default CheckListPopover
