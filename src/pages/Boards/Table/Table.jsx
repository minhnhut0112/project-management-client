import { useState } from 'react'
import {
  Avatar,
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import dayjs from 'dayjs'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import ModalCardDetails from '../BoardContent/ListCards/Card/CardDetails/CardDetails'
import { isColorLight } from '@/utils/formatters'
import LabelPopover from '@/components/LabelPopover/LabelPopover'
import AddIcon from '@mui/icons-material/Add'
import MembersPopover from '@/components/MembersPopover/MembersPopover'
import DatePopover from '@/components/DatePopover/DatePopover'
import { useMutation } from '@tanstack/react-query'
import { updateCardAPI } from '@/apis/cards.api'

export default function BasicTable({ board }) {
  const [modalOpen, setModalOpen] = useState('')
  const [cardData, setCardData] = useState(null)
  const [anchorElLabel, setAnchorElLabel] = useState(null)
  const [isHoveringLabel, setIsHoveringLabel] = useState(false)

  const [anchorElMember, setAnchorElMember] = useState(null)
  const [isHoveringMember, setIsHoveringMember] = useState(false)

  const [anchorElDates, setAnchorElDates] = useState(null)
  const [isHoveringDates, setIsHoveringDates] = useState(false)

  const handleLabelPopoverOpen = (event, card) => {
    setAnchorElLabel(event.currentTarget)
    setCardData(card)
  }

  const handleMemberPopoverOpen = (event, card) => {
    setAnchorElMember(event.currentTarget)
    setCardData(card)
  }

  const handleDatesPopoverOpen = (event, card) => {
    setAnchorElDates(event.currentTarget)
    setCardData(card)
  }

  const mutionUpdateCardStatus = useMutation({
    mutationFn: async (data) => {
      const status = { completed: data.completed }
      const res = await updateCardAPI(data.cardId, status)
      return res.data
    }
  })

  const updateCardStatus = (card) => {
    mutionUpdateCardStatus.mutate({ cardId: card._id, completed: !card?.completed })
  }

  function createData(card, list, labels, members, dueDate, cardId) {
    return { card, list, labels, members, dueDate, cardId }
  }

  const rows = []

  function extractDataFromBoard(board) {
    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        const title = (
          <Box sx={{ cursor: 'pointer' }}>
            <Box onClick={() => setModalOpen(card._id)}> {card?.title}</Box>
            {modalOpen === card._id && (
              <ModalCardDetails
                card={card}
                open={modalOpen}
                columnTitle={column.title}
                onClose={() => {
                  setModalOpen('')
                }}
              />
            )}
          </Box>
        )

        const labels = (
          <Box
            sx={{ display: 'flex', gap: 1 }}
            onClick={(e) => handleLabelPopoverOpen(e, card)}
            onMouseEnter={() => setIsHoveringLabel(card._id)}
            onMouseLeave={() => setIsHoveringLabel(null)}
          >
            {card?.labels.map((label, index) => (
              <Box
                key={index}
                sx={{
                  minWidth: '70px',
                  bgcolor: `${label.bgColor}`,
                  height: '25px',
                  p: '0 12px',
                  borderRadius: ' 3px',
                  display: 'flex',
                  alignItems: 'center',
                  color: isColorLight(label.bgColor) ? 'black' : 'white',
                  cursor: 'pointer'
                }}
              >
                {label.labelTitle}
              </Box>
            ))}

            {!card.labels.length ? (
              <Box>
                {isHoveringLabel !== card._id && '•'}
                <AddIcon sx={{ display: isHoveringLabel === card._id ? 'block' : 'none' }} />
              </Box>
            ) : (
              <ExpandMoreIcon sx={{ display: isHoveringLabel === card._id ? 'block' : 'none' }} />
            )}
          </Box>
        )

        const membersAvatars = (
          <Box
            sx={{ display: 'flex', gap: 1 }}
            onClick={(e) => handleMemberPopoverOpen(e, card)}
            onMouseEnter={() => setIsHoveringMember(card._id)}
            onMouseLeave={() => setIsHoveringMember(null)}
          >
            {card.members.map((member, index) => (
              <Avatar
                key={index}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: member?.avatarColor
                }}
                src={member?.avatar}
              >
                {member?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            ))}
            {!card.members.length && (
              <Box>
                {isHoveringMember !== card._id && '•'}
                <AddIcon sx={{ display: isHoveringMember === card._id ? 'block' : 'none' }} />
              </Box>
            )}
          </Box>
        )

        const currentDateTime = dayjs()
        const isOverdue = currentDateTime.isAfter(card?.dateTime?.dueDateTime)
        const isComplete = card?.completed

        let bgColor = ''
        let color = ''
        if (isComplete) {
          bgColor = '#1f845a'
          color = 'white'
        } else if (isOverdue) {
          bgColor = '#ffeceb'
          color = '#ae2e24'
        }

        const dateTime = (
          <>
            <Box
              sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
              onMouseEnter={() => setIsHoveringDates(card._id)}
              onMouseLeave={() => setIsHoveringDates(null)}
            >
              {card.dateTime && (
                <>
                  <Checkbox onChange={() => updateCardStatus(card)} checked={card?.completed} sx={{ p: 0 }} />
                  <Box
                    onClick={(e) => handleDatesPopoverOpen(e, card)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: bgColor,
                      color: color,
                      borderRadius: '3px',
                      p: 1,
                      height: '25px',
                      fontSize: '12px',
                      width: 'fit-content'
                    }}
                  >
                    {card.dateTime && (
                      <>
                        <AccessTimeOutlinedIcon sx={{ fontSize: '16px', mr: 0.5 }} />
                        <Box>
                          {dayjs(card?.dateTime?.startDateTime).format('MMM D')} -{' '}
                          {dayjs(card?.dateTime?.dueDateTime).format('MMM D')}
                        </Box>
                      </>
                    )}
                  </Box>
                </>
              )}

              <Box onClick={(e) => handleDatesPopoverOpen(e, card)}>
                {!card.dateTime && (
                  <Box>
                    {isHoveringDates !== card._id && <Box sx={{ ml: 1 }}>•</Box>}
                    <AddIcon sx={{ display: isHoveringDates === card._id ? 'block' : 'none' }} />
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )

        rows.push(createData(title, column?.title, labels, membersAvatars, dateTime, card._id))
      })
    })
  }

  extractDataFromBoard(board)

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#ffffff',
        overflow: 'auto',
        borderRadius: '5px',
        p: 1
      }}
    >
      <TableContainer component={Paper} sx={{ borderRadius: 'none', boxShadow: 'none', height: '100%' }}>
        <Table aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>Card</TableCell>
              <TableCell>List</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell>Members</TableCell>
              <TableCell>Dates</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell width={200} sx={{ '&:hover': { bgcolor: '#f5f5f5' }, p: 1, cursor: 'pointer' }}>
                  {row.card}
                </TableCell>
                <TableCell width={200} sx={{ '&:hover': { bgcolor: '#f5f5f5' }, p: 1 }}>
                  {row.list}
                </TableCell>
                <TableCell width={400} sx={{ '&:hover': { bgcolor: '#f5f5f5' }, p: 1, cursor: 'pointer' }}>
                  {row.labels}
                </TableCell>
                <TableCell
                  width={200}
                  height='50px'
                  sx={{ '&:hover': { bgcolor: '#f5f5f5' }, p: 1, cursor: 'pointer' }}
                >
                  {row.members}
                </TableCell>
                <TableCell width={200} sx={{ '&:hover': { bgcolor: '#f5f5f5' }, p: 1, cursor: 'pointer' }}>
                  {row.dueDate}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {cardData && (
        <>
          <LabelPopover
            card={cardData}
            open={Boolean(anchorElLabel)}
            anchorEl={anchorElLabel}
            handleClose={() => {
              setAnchorElLabel(null)
            }}
          />

          <MembersPopover
            card={cardData}
            open={Boolean(anchorElMember)}
            anchorEl={anchorElMember}
            handleClose={() => {
              setAnchorElMember(null)
            }}
          />

          <DatePopover
            card={cardData}
            open={Boolean(anchorElDates)}
            anchorEl={anchorElDates}
            handleClose={() => {
              setAnchorElDates(null)
            }}
          />
        </>
      )}
    </Box>
  )
}
