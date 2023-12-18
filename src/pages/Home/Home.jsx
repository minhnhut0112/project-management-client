import { Container, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Boards from './Boards/Boards'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography variant='h6'>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  }
}

const Home = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.todolist.boardHeight
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          padding: { xs: 1, md: 5 }
        }}
      >
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={value}
          onChange={handleChange}
          aria-label='Vertical tabs example'
          sx={{
            width: { xs: 100, md: 300 },
            '& .MuiTabs-indicator': {
              bgcolor: 'white'
            },
            '& .MuiTab-textColorPrimary': {
              color: 'white'
            },
            '& .Mui-selected': {
              color: 'white'
            },
            '& .css-1gkccsc-MuiButtonBase-root-MuiTab-root.Mui-selected': {
              color: 'white',
              textTransform: 'none'
            },
            '&  .css-1gkccsc-MuiButtonBase-root-MuiTab-root': {
              textTransform: 'none'
            }
          }}
        >
          <Tab label='Boards' {...a11yProps(0)} />
          <Tab label='Starred' {...a11yProps(1)} />
          <Tab label='Members' {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Boards />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>
    </Container>
  )
}

export default Home
