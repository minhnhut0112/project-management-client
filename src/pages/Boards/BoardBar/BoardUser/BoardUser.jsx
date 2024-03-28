import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { Avatar, AvatarGroup, Box, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'

const BoardUser = ({ board }) => {
  const user = useSelector((state) => state.user.auth)

  const checkPermission = (member, board) => {
    if (member && board) {
      if (member._id === board.ownerId) {
        return 'yellow'
      }

      if (board.assistant && board.assistant.some((admin) => admin === member._id)) {
        return 'white'
      }

      if (board.members && board.members.some((memberId) => memberId === member._id)) {
        return 0
      }
    }

    return 0
  }

  const userItems = board?.userInBoard
    ?.sort((a, b) => {
      if (user?._id === a?._id) return -1
      if (user?._id === b?._id) return 1
      return 0
    })
    ?.map((user) => {
      const permission = checkPermission(user, board)
      return (
        <Tooltip key={user?._id} title={user?.username}>
          <div
            style={{
              position: 'relative'
            }}
          >
            <Avatar sx={{ bgcolor: user?.avatarColor }} src={user?.avatar} alt={user?.username}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <KeyboardDoubleArrowUpIcon
              sx={{ fontSize: 15 }}
              style={{
                position: 'absolute',
                bottom: -3,
                right: -5,
                color: permission !== 0 ? permission : 'transparent',
                backgroundColor: permission !== 0 ? '#a4b0be' : 'transparent',
                borderRadius: '50%'
              }}
            />
          </div>
        </Tooltip>
      )
    })

  return (
    <Box>
      <AvatarGroup
        max={4}
        sx={{
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            fontSize: 16,
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          },
          gap: 1.25
        }}
      >
        {userItems}
      </AvatarGroup>
    </Box>
  )
}

export default BoardUser
