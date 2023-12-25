import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { Grid, TextField } from '@mui/material'

export default function ModalCardDetails({ open, onClose, card, columnTitle }) {
  return (
    <div>
      <Modal
        data-no-dnd
        open={open}
        onClose={onClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            width: { xs: 350, md: 800 },
            borderRadius: '5px'
          }}
        >
          {card.cover && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#b2bec3' : '#dfe6e9'),
                borderRadius: '5px 5px 0 0'
              }}
            >
              <img height={200} src={card?.cover} />
            </Box>
          )}
          <Grid container>
            <Grid item xs={10}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SubtitlesOutlinedIcon />
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                    id='modal-modal-title'
                  >
                    {card?.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} /> <Typography>In list {columnTitle}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionOutlinedIcon />
                  <Typography id='modal-modal-title'>Desciption</Typography>
                </Box>
                <TextField
                  sx={{ width: '100%' }}
                  id='outlined-textarea'
                  label='Multiline Placeholder'
                  placeholder='Placeholder'
                  multiline
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box sx={{ p: 2 }}>Action</Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  )
}
