import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import GroupIcon from '@mui/icons-material/Group'
import { Box, Button, Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import ModalCardDetails from './CardDetails/CardDetails'
const Card = ({ card, columnTitle }) => {
  const idShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
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
            height='140'
            image={card.cover}
            alt={card.title}
            sx={{
              objectFit: 'cover',
              height: '100%',
              width: '100%'
            }}
          />
        )}

        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': {
              p: 1.5
            }
          }}
        >
          <Typography>{card?.title} </Typography>
        </CardContent>

        {idShowCardActions() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && (
              <Button size='small' startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size='small' startIcon={<CommentOutlinedIcon />}>
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button size='small' startIcon={<AttachmentOutlinedIcon />}>
                {card?.attachments?.length}
              </Button>
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