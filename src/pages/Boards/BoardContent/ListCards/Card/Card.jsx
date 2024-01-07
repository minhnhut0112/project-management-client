import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { Box, Card as MuiCard, Tooltip } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import ModalCardDetails from './CardDetails/CardDetails'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import dayjs from 'dayjs'

const Card = ({ card, columnTitle }) => {
  const idShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.description ||
      !!card?.attachment?.length ||
      !!card?.dateTime
    )
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyle = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  }

  const [modalOpen, setModalOpen] = useState(false)

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const [startDateTime, setStartDateTime] = useState(null)
  const [dueDateTime, setDueDateTime] = useState(null)

  useEffect(() => {
    if (card?.dateTime) {
      setStartDateTime(dayjs(card?.dateTime?.startDateTime))
      setDueDateTime(dayjs(card?.dateTime?.dueDateTime))
    }
  }, [card.dateTime])

  return (
    <Box>
      <MuiCard
        onClick={() => setModalOpen(true)}
        ref={setNodeRef}
        style={dndKitCardStyle}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': {
            borderColor: (theme) => theme.palette.primary.main
          }
        }}
      >
        {card?.cover && (
          <CardMedia
            component='img'
            image={card.cover}
            alt={card.title}
            sx={{
              objectFit: 'cover',
              height: '100%',
              width: '100%',
              borderRadius: '3px 3px 0 0'
            }}
          />
        )}

        <CardContent
          sx={{
            p: 1,
            '&:last-child': {
              p: 1.5
            }
          }}
        >
          <Typography>{card?.title} </Typography>
        </CardContent>

        {idShowCardActions() && (
          <CardActions sx={{ p: '0 4px 5px 4px', display: 'flex', gap: 1, marginLeft: 1 }}>
            {!!card?.description && (
              <Tooltip title='Card has description'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Tooltip>
            )}
            {!!card?.dateTime && (
              <Tooltip title='Estimated completion time'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: '18px', mr: 0.5 }} />
                  <Box>
                    {dayjs(startDateTime).format('MMM D')} - {dayjs(dueDateTime).format('MMM D')}
                  </Box>
                </Box>
              </Tooltip>
            )}
            {!!card?.comments?.length && (
              <Tooltip title='Coments'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CommentOutlinedIcon fontSize='small' />
                  <Typography variant='caption' sx={{ fontSize: '12px' }}>
                    {card?.attachment?.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            {!!card?.attachment?.length && (
              <Tooltip title='Attachments'>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachmentOutlinedIcon fontSize='small' />
                  <Typography variant='caption' sx={{ fontSize: '12px' }}>
                    {card?.attachment?.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </CardActions>
        )}
      </MuiCard>
      {modalOpen && (
        <ModalCardDetails card={card} open={modalOpen} columnTitle={columnTitle} onClose={handleModalClose} />
      )}
    </Box>
  )
}

export default Card
