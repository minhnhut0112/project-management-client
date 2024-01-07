import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined'
import { Button, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import dayjs from 'dayjs'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCardAPI } from '@/apis/cards.api'
import { toast } from 'react-toastify'

const chipStyle = {
  fontSize: '15px',
  justifyContent: 'start',
  borderRadius: '4px',
  width: '100%',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
  border: 'none'
}

const DatePopover = ({ card }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setStartDateTime(null)
    setDueDateTime(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'dates-popover' : undefined

  const [startDateTime, setStartDateTime] = useState(null)
  const [dueDateTime, setDueDateTime] = useState(null)

  useEffect(() => {
    if (card?.dateTime) {
      setStartDateTime(dayjs(card?.dateTime?.startDateTime))
      setDueDateTime(dayjs(card?.dateTime?.dueDateTime))
    } else {
      setStartDateTime(dayjs())
      setDueDateTime(dayjs().add(1, 'day'))
    }
  }, [open, card])

  const handleChangeStartDateTime = (date) => {
    if (dueDateTime && date.isAfter(dueDateTime)) {
      setDueDateTime(date)
    }

    setStartDateTime(date)
  }

  const handleChangeDueDateTime = (date) => {
    if (date.isBefore(startDateTime)) {
      setStartDateTime(date)
    }

    setDueDateTime(date)
  }

  const [dueDateReminder, setDueDateReminder] = useState(10)

  const queryClient = useQueryClient()

  const mutiionUpdateDate = useMutation({
    mutationFn: (data) => {
      const dateTime = {
        dateTime: { ...data }
      }
      updateCardAPI(card._id, dateTime)
    }
  })

  const handleUpdateDate = () => {
    mutiionUpdateDate.mutate(
      {
        startDateTime: startDateTime.valueOf(),
        dueDateTime: dueDateTime.valueOf()
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['board'] })
          toast.success('Update Date Time is successfully!')
        }
      }
    )
    handleClose()
  }

  return (
    <Box>
      <Chip
        icon={<QueryBuilderOutlinedIcon />}
        onClick={handleClick}
        onTouchStart={handleClick}
        sx={chipStyle}
        label='Dates'
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
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{ mx: 2, marginBottom: 10 }}
      >
        <Box
          sx={{
            width: 280,
            p: 2,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#ebecf0')
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ marginLeft: '35px' }}></Box>
            <Typography sx={{ fontSize: '16px' }} variant='h6'>
              Dates
            </Typography>
            <IconButton sx={{ p: 0 }} onClick={handleClose} aria-label='delete'>
              <ClearOutlinedIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box>
            <Typography variant='caption'>Start Date</Typography>
            <DateTimePicker sx={{ mt: 0.5, mb: 0.5 }} value={startDateTime} onChange={handleChangeStartDateTime} />
          </Box>
          <Box>
            <Typography variant='caption'>Due Date</Typography>
            <DateTimePicker sx={{ mt: 0.5, mb: 0.5 }} value={dueDateTime} onChange={handleChangeDueDateTime} />
          </Box>
          <Box>
            <Typography variant='caption'>Set due date reminder</Typography>
            <Box sx={{ mt: 0.5 }}>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'></InputLabel>
                <Select
                  sx={{ mb: 1 }}
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={dueDateReminder}
                  onChange={(e) => setDueDateReminder(e.target.value)}
                >
                  <MenuItem value={10} selected>
                    1 Day before
                  </MenuItem>
                  <MenuItem value={20}> 2 Day before</MenuItem>
                  <MenuItem value={30}> 3 Day before</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Button
            sx={{
              bgcolor: '#4F46E5',
              width: '100%'
            }}
            variant='contained'
            disableElevation
            onClick={handleUpdateDate}
          >
            Save
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default DatePopover
