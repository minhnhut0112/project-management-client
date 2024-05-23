import { Avatar, Box, Tooltip, Typography } from '@mui/material'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import MembersPopover from '@/components/MembersPopover/MembersPopover'

const Members = ({ card, Permission }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
      <Box>
        <Typography variant='h6' sx={{ fontSize: '16px' }}>
          Members
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {card?.members?.map((member) => (
            <Tooltip title={member?.username} key={member?._id}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: member?.avatarColor
                }}
                src={member?.avatar}
              >
                {member?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>
          ))}
          {Permission !== 1 && (
            <Box
              onClick={(event) => {
                setAnchorEl(event.currentTarget)
              }}
              sx={{
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#a1bdd914',
                p: 1
              }}
            >
              <AddIcon />
            </Box>
          )}
        </Box>
      </Box>
      <MembersPopover
        card={card}
        id={Boolean(anchorEl) ? 'dates-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={() => {
          setAnchorEl(null)
        }}
        // onPopoverChange={handlePopoverChange}
      />
    </Box>
  )
}

export default Members
