import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { IconButton, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Checkbox from '@mui/material/Checkbox'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCardAPI } from '@/apis/cards.api'
import { toast } from 'react-toastify'

const LabelPopover = ({ anchorEl, handleClose, card, id, open }) => {
  const checkboxesData = [
    { bgColor: '#4BCE97', labelTitle: 'Okk1adasdasdasdasdas' },
    { bgColor: '#f5cd47', labelTitle: 'Okk2' },
    { bgColor: '#f87168', labelTitle: 'Okk3' },
    { bgColor: '#9f8fef', labelTitle: 'Okk4' },
    { bgColor: '#ea4787', labelTitle: 'Okk5' }
  ]

  const [label, setLabel] = useState([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLabel(card.label || [])
  }, [card.label])

  const queryClient = useQueryClient()

  const mutiionUpdateLable = useMutation({
    mutationFn: async (data) => {
      const label = { label: data }
      await updateCardAPI(card._id, label.label)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('board')
      // toast.success('Update Label is successfully!')
    }
  })

  const handleCheckboxChange = (index) => (event) => {
    const isChecked = event.target.checked

    if (isChecked) {
      setLabel((prevCheckedCheckboxes) => [...prevCheckedCheckboxes, checkboxesData[index]])
    } else {
      setLabel((prevCheckedCheckboxes) =>
        prevCheckedCheckboxes.filter(
          (item) =>
            item.bgColor !== checkboxesData[index].bgColor || item.labelTitle !== checkboxesData[index].labelTitle
        )
      )
    }
    setHasChanges(true)
  }

  useEffect(() => {
    if (hasChanges) {
      mutiionUpdateLable.mutate({ label })
      setHasChanges(false)
    }
  }, [label, hasChanges, mutiionUpdateLable])

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

          {checkboxesData.map((checkbox, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={label.some(
                  (item) => item.bgColor === checkbox.bgColor && item.labelTitle === checkbox.labelTitle
                )}
                onChange={handleCheckboxChange(index)}
              />
              <Box
                sx={{
                  bgcolor: checkbox.bgColor,
                  width: '100%',
                  height: '30px',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1,
                  mr: 1
                }}
              >
                {checkbox.labelTitle}
              </Box>
              <EditOutlinedIcon fontSize='small' />
            </Box>
          ))}
        </Box>
        {/* <Box sx={{ border: '1px solid #579dff', p: '1px', width: '53px', height: '23px' }}>
          <Box sx={{ bgcolor: '#4BCE97', width: '50px', height: '20px' }}></Box>
        </Box> */}
      </Box>
    </Popover>
  )
}

export default LabelPopover
