import { deleteCardAPI, updateCardAPI } from '@/apis/cards.api'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SubtitlesOutlinedIcon from '@mui/icons-material/SubtitlesOutlined'
import { Grid, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Attachments from './Attachments/Attachments'
import AttachmentsPopover from './AttachmentChip/AttachmentChip'
import CoverPopover from './CoverPopover/CoverPopover'
import Description from './Description/Description'
import DateTimes from './DateTimes/DateTimes'
import DateChip from './DateChip/DateChip'
import LabelChip from './LabelChip/LabelChip'
import Labels from './Labels/Labels'
import CheckListChip from './CheckListChip/CheckListChip'
import CheckList from './CheckList/CheckList'
import ConfirmationPopover from '@/components/ConfirmationPopover/ConfirmationPopover'

const chipStyle = {
  fontSize: '15px',
  justifyContent: 'start',
  borderRadius: '4px',
  width: '100%',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353b48' : '#dfe6e9'),
  border: 'none'
}

export default function ModalCardDetails({ open, onClose, card, columnTitle }) {
  const [openNewCardTitleForm, setOpenNewCardTitleForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')

  useEffect(() => {
    if (card) {
      setNewCardTitle(card.title)
    }
  }, [card])

  const queryClient = useQueryClient()

  const mutionEditCardTitle = useMutation({
    mutationFn: (data) => updateCardAPI(card._id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const editCardTitle = () => {
    if (newCardTitle === card.title || !newCardTitle) {
      setOpenNewCardTitleForm(false)
      setNewCardTitle(card.title)
      return
    }

    mutionEditCardTitle.mutate({
      title: newCardTitle
    })
    setOpenNewCardTitleForm(false)
  }

  const mutionDeleteCard = useMutation({
    mutationFn: (id) => deleteCardAPI(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] })
  })

  const [anchorEl, setAnchorEl] = useState(null)

  const handleConfirm = () => {
    mutionDeleteCard.mutate(card._id)
  }

  return (
    <Box>
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
            borderRadius: '5px',
            '&:focus': { outline: 'none' }
          }}
        >
          <Box
            sx={{
              p: '0 2px 0 0',
              width: { xs: 350, md: 800 },
              maxWidth: { xs: 350, md: 800 },
              height: { xs: 700, md: 700 },
              maxHeight: { xs: 700, md: 800 },
              overflowY: 'auto',
              overflowX: 'hidden',
              '&::-webkit-scrollbar-track': {
                m: 1
              }
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
                <img height={170} src={card.cover} alt='Card Cover' />
              </Box>
            )}

            <Grid container>
              <Grid item xs={7} md={9} sx={{ overflowY: 'auto' }}>
                <Box
                  sx={{
                    p: 2
                  }}
                >
                  {/* Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '40px' }}>
                    <SubtitlesOutlinedIcon />
                    <Box sx={{ width: '100%' }} onClick={() => setOpenNewCardTitleForm(true)}>
                      {openNewCardTitleForm ? (
                        <Box
                          as='form'
                          onSubmit={(e) => {
                            e.preventDefault()
                            editCardTitle()
                          }}
                        >
                          <TextField
                            fullWidth
                            type='text'
                            value={newCardTitle}
                            onBlur={editCardTitle}
                            autoFocus
                            data-no-dnd='true'
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            size='small'
                            sx={{
                              '& label': {
                                color: 'text.primary'
                              },

                              '& label.Mui-focused': {
                                color: (theme) => theme.palette.primary.main
                              },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                                '&:hover fieldset': {
                                  borderColor: (theme) => theme.palette.primary.main
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: (theme) => theme.palette.primary.main
                                }
                              },
                              '& .MuiOutlinedInput-input': {
                                borderRadius: 1
                              }
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography
                          variant='h6'
                          sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                          id='modal-modal-title'
                        >
                          {newCardTitle}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <SubtitlesOutlinedIcon sx={{ color: 'transparent' }} />
                    <Typography>In list {columnTitle}</Typography>
                  </Box>

                  {card?.labels && <Labels card={card} />}

                  {card?.dateTime && <DateTimes card={card} />}

                  <Description card={card} />

                  {!!card?.attachment?.length && <Attachments card={card} />}

                  {card?.checklist && <CheckList checklist={card.checklist} cardId={card._id} />}
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
                  <Chip
                    icon={<PersonOutlineOutlinedIcon fontSize='small' />}
                    sx={chipStyle}
                    label='Join'
                    clickable
                    variant='outlined'
                  />
                  <Typography>Add to card</Typography>
                  <DateChip card={card} />
                  <Chip icon={<GroupAddOutlinedIcon />} sx={chipStyle} label='Members' clickable variant='outlined' />
                  <LabelChip card={card} />
                  <CoverPopover card={card} />

                  <AttachmentsPopover card={card} />
                  <CheckListChip card={card} />
                  <Typography>Actions</Typography>

                  <Chip
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget)
                    }}
                    icon={<DeleteOutlineOutlinedIcon />}
                    sx={{
                      ...chipStyle,
                      '&:hover': {
                        color: 'error.light',
                        '& .MuiChip-iconColorDefault': {
                          color: 'error.light'
                        }
                      }
                    }}
                    label='Delete'
                    clickable
                    variant='outlined'
                  />
                  <ConfirmationPopover
                    id={Boolean(anchorEl) ? 'attachments-popover' : undefined}
                    title='Delete card?'
                    description='All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    handleClose={() => {
                      setAnchorEl(null)
                    }}
                    onConfirm={handleConfirm}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
