import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Avatar, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const Activity = ({ handleChangeContent, handleClose, board }) => {
  const [boardActivitys, setBoardActivitys] = useState([])

  useEffect(() => {
    const allActivities = []

    board.columns?.forEach((column) => {
      column.cards?.forEach((card) => {
        card?.activitys?.forEach((acti) => {
          allActivities.push(acti)
        })
      })
    })

    allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    setBoardActivitys(allActivities)
  }, [board])

  return (
    <Box sx={{ width: 340, p: 1 }}>
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
          Activity
        </Typography>
        <IconButton onClick={handleClose} aria-label='delete'>
          <ClearOutlinedIcon fontSize='small' />
        </IconButton>
      </Box>

      <Divider sx={{ m: 1 }} />

      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        {boardActivitys?.map((activity, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: activity?.avatarColor
              }}
              src={activity?.avatar}
            >
              {activity?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant='h6'
                sx={{
                  fontSize: '14px'
                }}
              >
                {activity?.fullname}{' '}
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: '14px'
                  }}
                >
                  {activity?.description} {dayjs(activity.timestamp).format('MMM D [at] h:mm A')}
                </Typography>
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Activity
