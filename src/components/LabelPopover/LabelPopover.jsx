import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { IconButton, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCardAPI } from '@/apis/cards.api'

const LabelPopover = ({ anchorEl, handleClose, card, id, open, labels, onPopoverChange }) => {
  const [label, setLabel] = useState(labels)

  useEffect(() => {
    setLabel(labels)
  }, [labels])

  const queryClient = useQueryClient()

  const mutationUpdateLabel = useMutation({
    mutationFn: async (data) => {
      const label = { label: data }
      const response = await updateCardAPI(card._id, label)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries('board')
      // toast.success('Update Label is successfully!')
    }
  })

  const handleCheckboxChange = (index) => {
    const updatedLabel = [...label]

    updatedLabel[index] = {
      ...updatedLabel[index],
      checked: !updatedLabel[index].checked
    }

    setLabel(updatedLabel)

    onPopoverChange(updatedLabel)

    mutationUpdateLabel.mutate(updatedLabel)
  }

  return (
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
        vertical: 'bottom',
        horizontal: 'left'
      }}
      sx={{ mx: 2, marginBottom: 10 }}
    >
      <Box
        sx={{
          width: 330,
          p: 2,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#ebecf0')
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ marginLeft: '15px' }}></Box>
          <Typography sx={{ fontSize: '16px' }} variant='h6'>
            Labels
          </Typography>
          <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
            <ClearOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>

        <TextField size='small' fullWidth placeholder='Search Labels...' />

        <Box sx={{ mt: 0.5 }}>
          <Typography variant='caption'>Labels</Typography>

          {label?.map((label, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox onChange={() => handleCheckboxChange(index)} checked={label.checked} />
              <Box
                sx={{
                  bgcolor: label.bgColor,
                  width: '100%',
                  height: '30px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1,
                  mr: 1
                }}
              >
                {label.labelTitle}
              </Box>
              <EditOutlinedIcon fontSize='small' />
            </Box>
          ))}
        </Box>
      </Box>
    </Popover>
  )
}

export default LabelPopover
