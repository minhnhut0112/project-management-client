import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import Chip from '@mui/material/Chip'
import { Button, Grid, TextField } from '@mui/material'
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined'
import { useState } from 'react'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const chipStyle = {
  fontSize: '15px',
  justifyContent: 'start',
  borderRadius: '4px',
  width: '100%',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
  border: 'none'
}

export default function ModalCardDetails({ open, onClose, card, columnTitle }) {
  const [openDesciptionForm, setOpenDesciptionForm] = useState(false)
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
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : '#ebecf0'),
            width: { xs: 350, md: 800 },
            maxWidth: { xs: 350, md: 800 },
            height: { xs: 700, md: 700 },
            maxHeight: { xs: 700, md: 800 },
            borderRadius: '5px'
          }}
        >
          {card.cover && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#b2bec3' : '#dfe6e9'),
                borderRadius: '5px 5px 0 0',
                position: 'relative'
              }}
            >
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 5,
                  right: 5
                }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
              <img height={170} src={card?.cover} alt='Card Cover' />
            </Box>
          )}
          <Grid container>
            <Grid item xs={7} md={9}>
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} /> <Typography>In list {columnTitle}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ViewHeadlineOutlinedIcon />
                  <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    Desciption
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
                  {!openDesciptionForm ? (
                    <Chip
                      onClick={() => setOpenDesciptionForm(true)}
                      sx={{
                        borderRadius: '4px',
                        width: '100%',
                        justifyContent: 'start',
                        alignItems: 'start',
                        p: '5px 5px 0 0',
                        height: '50px',
                        mt: 1
                      }}
                      label='Add a more detailed description…'
                      clickable
                      variant='outlined'
                    />
                  ) : (
                    <Box sx={{ mt: 1, width: '100%' }}>
                      <TextField
                        autoFocus
                        sx={{ mt: 1, width: '100%', mb: 1 }}
                        id='outlined-multiline-static'
                        multiline
                        rows={4}
                        placeholder='Add a more detailed description…'
                      />
                      <Button variant='contained' sx={{ mx: 1 }}>
                        Save
                      </Button>
                      <Button onClick={() => setOpenDesciptionForm(false)} variant='text'>
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AttachmentOutlinedIcon />
                  <Typography variant='h6' sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                    Attachment
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              {!card?.cover && (
                <Box
                  sx={{
                    textAlign: 'end',
                    mx: 1,
                    mb: 3
                  }}
                >
                  <IconButton onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography>Suggested</Typography>
                <Chip icon={<PersonOutlineOutlinedIcon />} sx={chipStyle} label='Join' clickable variant='outlined' />
                <Typography>Add to card</Typography>
                <Chip icon={<GroupAddOutlinedIcon />} sx={chipStyle} label='Members' clickable variant='outlined' />
                <Chip icon={<LocalOfferOutlinedIcon />} sx={chipStyle} label='Labels' clickable variant='outlined' />
                <Chip icon={<QueryBuilderOutlinedIcon />} sx={chipStyle} label='Dates' clickable variant='outlined' />
                <Chip
                  icon={<AttachmentOutlinedIcon />}
                  sx={chipStyle}
                  label='Attachment'
                  clickable
                  variant='outlined'
                />
                <Chip
                  icon={<LibraryAddCheckOutlinedIcon />}
                  sx={chipStyle}
                  label='Checklist'
                  clickable
                  variant='outlined'
                />
                <Typography>Actions</Typography>
                <Chip icon={<DeleteOutlineOutlinedIcon />} sx={chipStyle} label='Delete' clickable variant='outlined' />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  )
}
