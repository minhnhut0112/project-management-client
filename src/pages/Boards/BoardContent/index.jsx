import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { Button } from '@mui/material'
import DragHandleOutlinedIcon from '@mui/icons-material/DragHandleOutlined'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined'

const Column_Header_Height = '50px'
const Column_Footer_Height = '56px'

const BoardContent = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.todolist.boardContentHeight,
        p: '10px 0'
      }}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2
          }
        }}
      >
        {/* Box column 01 */}
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) => `calc(${theme.todolist.boardContentHeight} - ${theme.spacing(5)})`
          }}
        >
          <Box
            sx={{
              height: Column_Header_Height,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              variant='h6'
              sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              Column Title
            </Typography>
            <Box>
              <Tooltip title='More Options'>
                <MoreHorizIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id='basic-column-dropdown'
                  aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id='basic-menu-column-dropdown'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardOutlinedIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Add new cart</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <DeleteOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box
            sx={{
              p: '0 5px',
              m: '0 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: (theme) =>
                `calc(${theme.todolist.boardContentHeight} - 
                ${theme.spacing(5)} - 
                ${Column_Header_Height} - 
                ${Column_Footer_Height})`,
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }}
          >
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image='https://trungquandev.com/wp-content/uploads/2022/07/fair-mern-stack-advanced-banner-trungquandev-scaled.jpg'
                title='green iguana'
              />
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Todo List </Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size='small' startIcon={<GroupIcon />}>
                  20
                </Button>
                <Button size='small' startIcon={<CommentOutlinedIcon />}>
                  20
                </Button>
                <Button size='small' startIcon={<AttachmentOutlinedIcon />}>
                  20
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              height: Column_Footer_Height,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button startIcon={<AddCardOutlinedIcon />}>Add a cart</Button>
            <Tooltip title='Drag to move'>
              <DragHandleOutlinedIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>
        </Box>

        {/* Box column 02 */}
        <Box
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) => `calc(${theme.todolist.boardContentHeight} - ${theme.spacing(5)})`
          }}
        >
          <Box
            sx={{
              height: Column_Header_Height,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              variant='h6'
              sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              Column Title
            </Typography>
            <Box>
              <Tooltip title='More Options'>
                <MoreHorizIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id='basic-column-dropdown'
                  aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id='basic-menu-column-dropdown'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardOutlinedIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Add new cart</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <DeleteOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box
            sx={{
              p: '0 5px',
              m: '0 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowX: 'hidden',
              overflowY: 'auto',
              maxHeight: (theme) =>
                `calc(${theme.todolist.boardContentHeight} - 
                ${theme.spacing(5)} - 
                ${Column_Header_Height} - 
                ${Column_Footer_Height})`,
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ced0da'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#bfc2cf'
              }
            }}
          >
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardMedia
                sx={{ height: 140 }}
                image='https://trungquandev.com/wp-content/uploads/2022/07/fair-mern-stack-advanced-banner-trungquandev-scaled.jpg'
                title='green iguana'
              />
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Todo List </Typography>
              </CardContent>
              <CardActions sx={{ p: '0 4px 8px 4px' }}>
                <Button size='small' startIcon={<GroupIcon />}>
                  20
                </Button>
                <Button size='small' startIcon={<CommentOutlinedIcon />}>
                  20
                </Button>
                <Button size='small' startIcon={<AttachmentOutlinedIcon />}>
                  20
                </Button>
              </CardActions>
            </Card>
            <Card
              sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset'
              }}
            >
              <CardContent
                sx={{
                  p: 1,
                  '&:last-child': {
                    p: 1
                  }
                }}
              >
                <Typography>Card 02</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box
            sx={{
              height: Column_Footer_Height,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button startIcon={<AddCardOutlinedIcon />}>Add a cart</Button>
            <Tooltip title='Drag to move'>
              <DragHandleOutlinedIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default BoardContent
