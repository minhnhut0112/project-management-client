import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { Avatar, IconButton, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Popover from '@mui/material/Popover'
import CheckIcon from '@mui/icons-material/Check'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBoardDetailsAPI } from '@/apis/boards.api'
import { useEffect, useState } from 'react'
import { updateCardAPI } from '@/apis/cards.api'
import { useSelector } from 'react-redux'

const MembersPopover = ({ anchorEl, handleClose, card, id, open }) => {
  const [boardMembers, setBoardMembers] = useState([])
  const [cardmembers, setCardMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const user = useSelector((state) => state.user.auth)

  const filteredMembers = boardMembers.filter((member) =>
    member.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    setCardMembers(card?.members || [])
  }, [card])

  const boardQuery = useQuery({
    queryKey: ['board', card.boardId],
    queryFn: async () => await fetchBoardDetailsAPI(card.boardId)
  })

  useEffect(() => {
    if (boardQuery.data) {
      const boardData = boardQuery.data
      setBoardMembers(boardData?.userInBoard)
    }
  }, [boardQuery.data])

  const queryClient = useQueryClient()

  const mutionAddMember = useMutation({
    mutationFn: () => updateCardAPI(card?._id, { members: cardmembers }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const mutionNotificationAddMember = useMutation({
    mutationFn: (memberId) =>
      updateCardAPI(card?._id, {
        notifications: [
          ...card.notifications,
          {
            avatar: user.avatar,
            username: user.username,
            fullname: user.fullname,
            type: 'add',
            cardname: `${card?.title}`,
            action: memberId,
            is_read: false,
            timestamp: new Date().valueOf()
          }
        ]
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const addMemberToCard = (member) => {
    if (card.members && card.members.some((cardMember) => cardMember._id === member._id)) {
      const updatedMembers = cardmembers.filter((existingMember) => existingMember?._id !== member._id)
      setCardMembers(updatedMembers)
    } else {
      setCardMembers((prevMembers) => [...prevMembers, member])
      mutionNotificationAddMember.mutate(member._id)
    }

    mutionAddMember.mutate()
  }

  return (
    <Popover
      data-no-dnd
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        handleClose()
        setSearchQuery('')
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left'
      }}
      sx={{ mx: 2, marginBottom: 10 }}
    >
      <Box
        sx={{
          p: 2,
          width: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#ebecf0')
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ marginLeft: '15px' }}></Box>
          <Typography sx={{ fontSize: '16px' }} variant='h6'>
            Members
          </Typography>
          <IconButton
            sx={{ p: 0 }}
            onClick={() => {
              handleClose()
              setSearchQuery('')
            }}
            aria-label='delete'
          >
            <ClearOutlinedIcon fontSize='small' />
          </IconButton>
        </Box>

        <TextField
          autoFocus
          fullWidth
          size='small'
          sx={{ mb: 1 }}
          placeholder='Search member...'
          type='search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Typography variant='body'>Board members</Typography>

        <List>
          {filteredMembers?.map((member) => (
            <ListItem disablePadding key={member._id}>
              <ListItemButton
                onClick={() => addMemberToCard(member)}
                sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, p: 0.5 }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Avatar size='small' sx={{ backgroundColor: member?.avatarColor }} src={member?.avatar}>
                    {member?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Typography>{member?.fullname}</Typography>
                </Box>
                {cardmembers.some((cardMember) => String(cardMember._id) === String(member._id)) && (
                  <CheckIcon fontSize='small' />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Popover>
  )
}

export default MembersPopover
