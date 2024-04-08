import { Avatar, Box, SvgIcon, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { ReactComponent as ActivitySVG } from '@/assets/activity-svg.svg'

const Activity = ({ card }) => {
  const [activitys, setActivitys] = useState([])

  useEffect(() => {
    if (card?.activitys) {
      setActivitys(card?.activitys)
    }
  }, [card?.activitys])

  return (
    <Box>
      <>
        <Box sx={{ display: 'flex', gap: 2, mb: 0.75, mt: 1 }}>
          <SvgIcon
            component={ActivitySVG}
            fontSize='small'
            inheritViewBox
            sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }}
          />
          <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Activity
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            {activitys?.map((activity, index) => (
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
                      {activity?.description} {dayjs(activity.timestamp).format('MMM D, YYYY [at] h:mm A')}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </>
    </Box>
  )
}

export default Activity
