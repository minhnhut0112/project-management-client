import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Button, Link, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import moment from 'moment'
import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useSelector } from 'react-redux'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'

const AllIssue = ({ handleChangeIndex, board, handleClickDetails }) => {
  const [searchKeyword, setSearchKeyword] = React.useState('')
  const [filterType, setFilterType] = React.useState('open')

  const user = useSelector((state) => state.user.auth)

  const handleFilterChange = (filter) => {
    setFilterType(filter)
    setAnchorEl(null)
  }

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  let filteredIssues = board?.issues

  filteredIssues = board?.issues.filter((issue) => {
    if (filterType === 'open') {
      return issue.opened === true
    } else if (filterType === 'closed') {
      return issue.opened === false
    } else if (filterType === 'your') {
      return user && issue.owner && user._id === issue.owner._id
    } else {
      return true
    }
  })

  if (searchKeyword) {
    filteredIssues = board?.issues
    filteredIssues = filteredIssues.filter((issue) => issue.title.toLowerCase().includes(searchKeyword.toLowerCase()))
  }

  const calculateTimeFromNow = (createdAt) => {
    const currentTime = moment()
    const attachmentTime = moment(createdAt)
    const duration = moment.duration(currentTime.diff(attachmentTime))

    const days = Math.floor(duration.asDays())
    const hours = duration.hours()
    const minutes = duration.minutes()

    if (days > 0) {
      if (days === 1) {
        return 'Opened yesterday'
      } else {
        return moment(createdAt).format('DD/MM/YYYY')
      }
    } else if (hours > 0) {
      return `Opened ${hours} hours ago`
    } else if (minutes > 0) {
      return `Opened ${minutes} minute ago`
    } else {
      return 'Opened just now'
    }
  }

  const clearSearchAndFilter = () => {
    setSearchKeyword('')
    setFilterType('open')
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'end' }}>
          <Button
            onClick={handleMenuClick}
            sx={{
              height: '40px'
            }}
            endIcon={<ExpandMoreIcon />}
            variant='outlined'
            disableElevation
          >
            Fillters
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleFilterChange('all')}>All Issues</MenuItem>
            <MenuItem onClick={() => handleFilterChange('open')}>Open Issues</MenuItem>
            <MenuItem onClick={() => handleFilterChange('closed')}>Closed Issues</MenuItem>
            <MenuItem onClick={() => handleFilterChange('your')}>Your Issues</MenuItem>
          </Menu>
          <TextField
            value={searchKeyword}
            onChange={handleSearchChange}
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
            boxShadow: 'none',
            height: '40px',
            '&:hover': {
              bgcolor: '#4F46E5',
              boxShadow: 'none'
            }
          }}
          variant='contained'
        >
          New issue
        </Button>
      </Box>

      {(searchKeyword || filterType !== 'open') && (
        <Box
          onClick={clearSearchAndFilter}
          sx={{
            mt: 2,
            display: 'flex',
            gap: 1,
            '&:hover': {
              color: 'primary.main',
              cursor: 'pointer'
            }
          }}
        >
          <HighlightOffOutlinedIcon />{' '}
          <Typography variant='body' sx={{ fontSize: 16, fontWeight: 400 }}>
            Clear current search query and filters: {filterType === 'all' && 'is:all'}{' '}
            {filterType === 'closed' && 'is:closed'} {filterType === 'your' && 'author:@me'}{' '}
            {searchKeyword && `keyword:${searchKeyword}`}
          </Typography>
        </Box>
      )}

      {!!filteredIssues.length ? (
        <>
          <List sx={{ border: '1px solid #535c68', borderRadius: '5px', mt: 2, p: 0 }}>
            {filteredIssues?.map((issue, index) => (
              <React.Fragment key={index}>
                <ListItem
                  onClick={() => {
                    handleChangeIndex(2)
                    handleClickDetails(issue._id)
                  }}
                  sx={{ '&:hover': { bgcolor: '#f5f5f5' }, justifyContent: 'start' }}
                >
                  <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    {issue.opened ? (
                      <AdjustOutlinedIcon color='success' />
                    ) : (
                      <CheckCircleOutlineOutlinedIcon sx={{ color: '#8d50df' }} />
                    )}
                    <Box>
                      <Typography variant='body' sx={{ fontSize: '16px', fontWeight: 500 }}>
                        {issue.title}
                      </Typography>
                      <Typography sx={{ fontSize: '14px' }}>
                        {calculateTimeFromNow(issue.createAt)} by {issue.owner.username}
                      </Typography>
                    </Box>
                  </Box>
                  {!!issue.comments.length && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <ModeCommentOutlinedIcon fontSize='small' /> <Typography>{issue.comments?.length}</Typography>
                    </Box>
                  )}
                </ListItem>
                {index !== filteredIssues.length - 1 && <Divider sx={{ bgcolor: '#95afc0' }} />}
              </React.Fragment>
            ))}
          </List>
        </>
      ) : (
        <>
          {board.issues.length === 0 ? (
            <Box
              sx={{
                border: '1px solid #535c68',
                borderRadius: '5px',
                mt: 2,
                height: 400,
                p: '100px 280px 100px 280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <AdjustOutlinedIcon />
              <Typography variant='h6' sx={{ fontSize: '24px', fontWeight: 'bold', mb: 2, mt: 2 }} textAlign='center'>
                Welcome to issues!
              </Typography>
              <Typography variant='body' textAlign='center' sx={{ fontSize: '16px', textAlign: 'center' }}>
                Issues are used to track todos, bugs, feature requests, and more. As issues are created, they’ll appear
                here in a searchable and filterable list. To get started, you should{' '}
                <Link sx={{ cursor: 'pointer' }} onClick={() => handleChangeIndex(1)}>
                  create an issue
                </Link>
                .
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                border: '1px solid #535c68',
                borderRadius: '5px',
                mt: 2,
                height: 400,
                p: '150px 280px 100px 280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <AdjustOutlinedIcon />
              <Typography variant='h6' sx={{ fontSize: '24px', fontWeight: 400, mb: 2, mt: 2 }} textAlign='center'>
                No results matched your search.
              </Typography>
            </Box>
          )}
        </>
      )}
    </div>
  )
}

export default AllIssue
