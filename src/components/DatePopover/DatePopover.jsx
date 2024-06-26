import { removeDatesAPI, updateDatesAPI } from '@/apis/cards.api'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Button, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const DatePopover = ({ anchorEl, handleClose, card, id, open }) => {
  const [startDateTime, setStartDateTime] = useState(null)
  const [dueDateTime, setDueDateTime] = useState(null)

  const user = useSelector((state) => state.user.auth)

  useEffect(() => {
    if (card?.dateTime) {
      setStartDateTime(dayjs(card?.dateTime?.startDateTime))
      setDueDateTime(dayjs(card?.dateTime?.dueDateTime))
    } else {
      setStartDateTime(dayjs())
      setDueDateTime(dayjs().add(1, 'day'))
    }
  }, [card, open])

  const handleChangeStartDateTime = (date) => {
    if (dueDateTime && date.isAfter(dueDateTime)) {
      setDueDateTime(dayjs(date).add(1, 'day'))
    }

    setStartDateTime(date)
  }

  const handleChangeDueDateTime = (date) => {
    if (date.isBefore(startDateTime)) {
      setStartDateTime(dayjs(date).subtract(1, 'day'))
    }

    setDueDateTime(date)
  }

  const queryClient = useQueryClient()

  const mutiionUpdateDate = useMutation({
    mutationFn: async (data) => {
      await updateDatesAPI(card._id, data, user?.accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('board')
    }
  })

  const handleUpdateDate = () => {
    mutiionUpdateDate.mutate({
      startDateTime: startDateTime.valueOf(),
      dueDateTime: dueDateTime.valueOf()
    })
    handleClose()
  }

  const mutiionRemoveDate = useMutation({
    mutationFn: (id) => removeDatesAPI(id, user?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries('board')
    }
  })

  const removeUpdateDate = () => {
    mutiionRemoveDate.mutate(card._id)
    handleClose()
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
        <Button
          sx={{
            bgcolor: '#4F46E5',
            width: '100%',
            mt: 0.5
          }}
          variant='contained'
          disableElevation
          onClick={handleUpdateDate}
        >
          Save
        </Button>
        <Button
          sx={{
            color: '#172b4d',
            bgcolor: '#091e420f',
            width: '100%',
            mt: 1,
            '&:hover': {
              bgcolor: '#091e420f'
            }
          }}
          variant='contained'
          disableElevation
          onClick={removeUpdateDate}
        >
          Remove
        </Button>
      </Box>
    </Popover>
  )
}

export default DatePopover
