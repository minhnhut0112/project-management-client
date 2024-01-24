import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { IconButton, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import { updateCardAPI } from '@/apis/cards.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBoardDetailsAPI } from '@/apis/boards.api'
const LabelPopover = ({ anchorEl, handleClose, card, id, open, onPopoverChange }) => {
  const [labels, setLabels] = useState([])
  const [checkedLabels, setCheckedLabels] = useState(card?.labels || [])

  const boardQuery = useQuery({
    queryKey: ['board', card.boardId],
    queryFn: async () => await fetchBoardDetailsAPI(card.boardId)
  })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data
      setLabels(boardData.labels)
    }
  }, [boardQuery.data])

  const queryClient = useQueryClient()

  const mutationUpdateLabel = useMutation({
    mutationFn: async (data) => await updateCardAPI(card._id, { labels: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const handleCheckboxChange = (label) => {
    setCheckedLabels((prevLabels) => {
      const isChecked = prevLabels?.some((checkedLabel) => checkedLabel._id === label._id)

      if (isChecked) {
        return prevLabels?.filter((checkedLabel) => checkedLabel._id !== label._id)
      } else {
        return [...prevLabels, label]
      }
    })

    setCheckedLabels((updatedLabels) => {
      mutationUpdateLabel.mutate(updatedLabels)
      if (onPopoverChange) {
        onPopoverChange(updatedLabels)
      }
      return updatedLabels
    })
  }

  const isLabelChecked = (label) => checkedLabels?.some((checkedLabel) => checkedLabel._id === label._id)

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

          {labels?.map((label) => (
            <Box key={label._id} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox checked={isLabelChecked(label)} onChange={() => handleCheckboxChange(label)} />
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
