import { fetchAllNotifications } from '@/apis/cards.api'
import { Avatar, Box, Divider, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const HomeNoti = () => {
  const [cards, setCards] = useState([])

  const user = useSelector((state) => state.user.auth)

  const cardNotifications = useQuery({
    queryKey: ['cardsNoti', user?._id],
    queryFn: async () => {
      if (!user?._id) return []
      return await fetchAllNotifications(user?._id)
    }
  })

  useEffect(() => {
    if (cardNotifications.data) {
      const boardData = cardNotifications.data

      setCards(boardData)
    }
  }, [cardNotifications.data])

  const compareCardsByLatestNotification = (a, b) => {
    const latestTimestampA = a.notifications?.length > 0 ? a.notifications[0].timestamp : 0
    const latestTimestampB = b.notifications?.length > 0 ? b.notifications[0].timestamp : 0

    return latestTimestampA > latestTimestampB ? -1 : latestTimestampA < latestTimestampB ? 1 : 0
  }

  useEffect(() => {
    if (cardNotifications.data) {
      const sortedCards = [...cardNotifications.data].sort(compareCardsByLatestNotification)
      setCards(sortedCards)
    }
  }, [cardNotifications.data])

  const calculateTimeFromNow = (createdAt) => {
    const currentTime = moment()
    const attachmentTime = moment(createdAt)
    const duration = moment.duration(currentTime.diff(attachmentTime))

    const days = Math.floor(duration.asDays())
    const hours = duration.hours()
    const minutes = duration.minutes()

    if (days > 0) {
      if (days === 1) {
        return 'yesterday'
      } else {
        return moment(createdAt).format('DD/MM/YYYY')
      }
    } else if (hours > 0) {
      return `${hours} hours ago`
    } else if (minutes > 0) {
      return `${minutes} minute ago`
    } else {
      return 'just now'
    }
  }
  return (
    <Box sx={{ width: 400, p: 2 }}>
      <Typography variant='h6'>Notifications</Typography>
      <Divider />
      <Box sx={{ mt: 2 }}>
        {cards
          .filter((card) => card?.notifications?.some((noti) => noti.username !== user.username))
          .map((card) => (
            <Box key={card._id}>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: '#e9f2ff',
                  mb: 2,
                  boxShadow: '0 1px 1px rgba(9, 45, 66, 0.25), 0 0 0 1px rgba(9, 45, 66, 0.08)',
                  borderRadius: '5px'
                }}
              >
                <Box sx={{ bgcolor: 'white', p: 1 }}>{card.title}</Box>
                {card?.notifications
                  .filter((noti) => noti.username !== user.username)
                  .map((noti, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: 2,
                        mb: 1,
                        p: 0.5,
                        bgcolor: noti.is_read && '#f1f2f4'
                      }}
                    >
                      <Avatar src={noti.avatar}></Avatar>
                      <Box>
                        <Box>{noti.fullname}</Box>
                        <Box>
                          {noti.action} at {calculateTimeFromNow(noti.timestamp)}
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default HomeNoti
