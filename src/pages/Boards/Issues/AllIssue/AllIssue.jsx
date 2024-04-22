import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import { Button, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import moment from 'moment'
import React, { useState } from 'react'

const AllIssue = ({ handleChangeIndex, board, handleClickDetails }) => {
  const calculateTimeFromNow = (createdAt) => {
    const currentTime = moment()
    const attachmentTime = moment(createdAt)
    const duration = moment.duration(currentTime.diff(attachmentTime))

    const days = Math.floor(duration.asDays())
    const hours = duration.hours()
    const minutes = duration.minutes()

    if (days > 0) {
      if (days === 1) {
        return 'Added yesterday'
      } else {
        return moment(createdAt).format('DD/MM/YYYY')
      }
    } else if (hours > 0) {
      return `Added ${hours} hours ago`
    } else if (minutes > 0) {
      return `Added ${minutes} minute ago`
    } else {
      return 'Added just now'
    }
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}>
          <Button
            type='submit'
            sx={{
              height: '40px'
            }}
            endIcon={<ExpandMoreIcon />}
            variant='outlined'
            disableElevation
          >
            Fillter
          </Button>
          <TextField
            placeholder='Search...'
            fullWidth
            type='search'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D') }} />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Button
          onClick={() => handleChangeIndex(1)}
          sx={{
            bgcolor: '#4F46E5',
            height: '40px'
          }}
          variant='contained'
        >
          New issue
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 1, p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <AdjustOutlinedIcon />
          <Typography variant='body'>3 Open</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon />
          <Typography variant='body'>1 Closed</Typography>
        </Box>
      </Box>

      <List sx={{ border: '1px solid #535c68', borderRadius: '5px', mt: 2 }}>
        {board?.issues?.map((issue, index) => (
          <React.Fragment key={index}>
            <ListItem
              onClick={() => {
                handleChangeIndex(2)
                handleClickDetails(issue)
              }}
              sx={{ '&:hover': { bgcolor: '#f5f5f5' }, justifyContent: 'start' }}
            >
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <AdjustOutlinedIcon />
                <Box>
                  <Typography variant='body'>{issue.title}</Typography>
                  <Typography>{calculateTimeFromNow(issue.createAt)}</Typography>
                </Box>
              </Box>
              {issue.comments && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <ModeCommentOutlinedIcon fontSize='small' /> <Typography>{issue.comments?.length}</Typography>
                </Box>
              )}
            </ListItem>
            {index !== board.issues.length - 1 && <Divider sx={{ bgcolor: '#95afc0' }} />}
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}

export default AllIssue
