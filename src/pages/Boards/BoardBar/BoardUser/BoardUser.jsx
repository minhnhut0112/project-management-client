import { Avatar, AvatarGroup, Box, Menu, Tooltip } from '@mui/material'
import { useState } from 'react'

const BoardUser = ({ board }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openUserId, setOpenUserId] = useState(null) // Lưu trữ userId của menu đang mở
  const handleClick = (event, userId) => {
    setAnchorEl(event.currentTarget)
    setOpenUserId(userId) // Lưu trữ userId của menu mới mở
  }
  const handleClose = () => {
    setAnchorEl(null)
    setOpenUserId(null) // Xóa userId của menu đang mở
  }
  const isMenuOpen = (userId) => openUserId === userId // Kiểm tra xem menu của một user có mở không

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
            cursor: 'pointer',

            '&:first-of-type': {
              bgcolor: '#a4b0be'
            }
          }
        }}
      >
        {board?.userInBoard?.map((user) => (
          <Tooltip key={user?._id} title={user?.username}>
            <Avatar
              onClick={(event) => handleClick(event, user?._id)} // Truyền userId vào handleClick
              sx={{ backgroundColor: user?.avatarColor }}
              src={user?.avatar}
              alt={user?.username}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>

      {board?.userInBoard?.map((user) => (
        <Menu
          key={user?._id}
          anchorEl={anchorEl}
          open={isMenuOpen(user?._id)}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
          sx={{ mt: 1 }}
        >
          <Box sx={{ width: '304px', height: '221px' }}>Thông tin của user {user?.username}</Box>
        </Menu>
      ))}
    </Box>
  )
}

export default BoardUser
