import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { Avatar, Box, Card as MuiCard, Tooltip } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import ModalCardDetails from './CardDetails/CardDetails'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined'
import dayjs from 'dayjs'
import { isColorLight } from '@/utils/formatters'

const Card = ({ card, columnTitle }) => {
  const idShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.description ||
      !!card?.attachments?.length ||
      !!card?.dateTime ||
      !!card?.checklist
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

  const currentDateTime = dayjs()

  const isOverdue = currentDateTime.isAfter(dueDateTime)
  const isComplete = card?.completed

  let status = ''
  let bgColor = ''
  let color = ''
  if (isComplete) {
    status = 'This card is complete.'
    bgColor = '#1f845a'
    color = 'white'
  } else if (isOverdue) {
    status = 'This card is past due.'
    bgColor = '#ffeceb'
    color = '#ae2e24'
  } else {
    status = 'This card is due later.'
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
            {card?.labels?.map((label) => (
              <Box
                key={label._id}
                sx={{
                  minWidth: '50px',
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
          <CardActions
            sx={{
              p: '0 4px 5px 4px',
              display: 'flex',
              ml: 0.5,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
              {!!card?.dateTime && (
                <Tooltip title={status}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: bgColor,
                      color: color,
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

              {!!card?.description && (
                <Tooltip title='Card has description'>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: '20px' }} />
                  </Box>
                </Tooltip>
              )}

              {!!card?.comments?.length && (
                <Tooltip title='Coments'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CommentOutlinedIcon fontSize='small' />
                    <Typography variant='caption' sx={{ fontSize: '12px' }}>
                      {card?.comments?.length}
                    </Typography>
                  </Box>
                </Tooltip>
              )}

              {!!card?.attachments?.length && (
                <Tooltip title='Attachments'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachmentOutlinedIcon fontSize='small' />
                    <Typography variant='caption' sx={{ fontSize: '12px' }}>
                      {card?.attachments?.length}
                    </Typography>
                  </Box>
                </Tooltip>
              )}

              {!!card?.checklist?.length && (
                <Tooltip title='Checklist'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LibraryAddCheckOutlinedIcon fontSize='small' />
                    <Typography variant='caption' sx={{ fontSize: '12px' }}>
                      {card?.checklist?.length}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>
            <Box sx={{ display: 'flex', width: '100%', gap: 0.5, justifyContent: 'end', mr: 1, mt: 0.5 }}>
              {card?.members?.map((member) => (
                <Tooltip title={member?.username} key={member?._id}>
                  <Avatar
                    size='small'
                    sx={{
                      backgroundColor: member?.avatarColor,
                      width: 30,
                      height: 30
                    }}
                    src={member?.avatar}
                  >
                    {member?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Box>
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
