import { Box } from '@mui/material'
import ProfileAndVisibility from './ProfileAndVisibility/ProfileAndVisibility'

const Profile = () => {
  return (
    <Box sx={{ borderTop: 1, borderColor: '#b2bec3', p: '20px 50px 40px 50px' }}>
      <Box sx={{ width: '100%' }}>
        <ProfileAndVisibility />
      </Box>
    </Box>
  )
}

export default Profile
