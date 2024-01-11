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

  const isColorLight = (color) => {
    const hexColor = color.substring(1) // Remove the '#' from the color
    const r = parseInt(hexColor.slice(0, 2), 16)
    const g = parseInt(hexColor.slice(2, 4), 16)
    const b = parseInt(hexColor.slice(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 // Adjust this threshold as needed
  }

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
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {card?.label?.map((label, index) => (
              <Box
                key={index}
                sx={{
                  height: '20px',
                  borderRadius: '3px',
                  bgcolor: `${label?.bgColor}`,
                  color: label?.bgColor ? (isColorLight(label.bgColor) ? 'black' : 'white') : 'inherit',
                  p: '1px 5px',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                {label.labelTitle}
              </Box>
            ))}
          </Box>
          <Typography>{card?.title} </Typography>
        </CardContent>

        {idShowCardActions() && (
          <CardActions sx={{ p: '0 4px 5px 4px', display: 'flex', gap: 0.5, ml: 0.5 }}>
            {!!card?.description && (
              <Tooltip title='Card has description'>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Tooltip>
            )}
            {!!card?.dateTime && (
              <Tooltip title='Estimated completion time'>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#4bce97' : '#1f845a'),
                    color: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#ffffff'),
                    borderRadius: '3px',
                    p: 0.5,
                    height: '20px',
                    fontSize: '12px'
                  }}
                >
                  <AccessTimeOutlinedIcon sx={{ fontSize: '16px', mr: 0.5 }} />
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
