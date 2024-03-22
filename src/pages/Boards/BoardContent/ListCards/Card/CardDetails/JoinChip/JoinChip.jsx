import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useEffect, useState } from 'react'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCardAPI } from '@/apis/cards.api'

const chipStyle = {
  fontSize: '15px',
  justifyContent: 'start',
  borderRadius: '4px',
  width: '100%',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
  border: 'none'
}

const JoinChip = ({ card }) => {
  const user = useSelector((state) => state.user.auth)
  const [cardmembers, setCardMembers] = useState([])

  useEffect(() => {
    setCardMembers(card?.members || [])
  }, [card])

  const queryClient = useQueryClient()

  const mutionAddMember = useMutation({
    mutationFn: () => updateCardAPI(card?._id, { members: cardmembers }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const addMemberToCard = () => {
    setCardMembers((prevMembers) => [
      ...prevMembers,
      {
        _id: user._id,
        avatar: user.avatar,
        username: user.username,
        avatarColor: user.avatarColor
      }
    ])
    mutionAddMember.mutate()
  }

  return (
    <Box>
      <Chip
        onClick={addMemberToCard}
        icon={<PersonOutlineOutlinedIcon fontSize='small' />}
        sx={chipStyle}
        label='Join'
        clickable
        variant='outlined'
      />
    </Box>
  )
}

export default JoinChip
