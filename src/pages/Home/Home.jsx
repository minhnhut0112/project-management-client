import { ReactComponent as LogoApp } from '@/assets/trello.svg'
import { Grid, SvgIcon, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import PropTypes from 'prop-types'
import * as React from 'react'
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
    <Grid container sx={{ borderTop: 1, borderColor: '#b2bec3' }}>
      <Grid item md={3} sx={{ padding: { xs: 1, md: '40px 0px 0px 40px' } }}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={value}
          onChange={handleChange}
          aria-label='Vertical tabs example'
          sx={{
            width: '300px',
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          <Tab
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'start',
              ...(value === 0 && { backgroundColor: '#e9f2ff', borderRadius: '12px' })
            }}
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  ...(value === 0 && { color: '#0c66e4' })
                }}
              >
                <SvgIcon component={LogoApp} fontSize='small' inheritViewBox />
                Boards
              </Box>
            }
            {...a11yProps(0)}
          />
          {/* <Tab
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'start',
              ...(value === 1 && { backgroundColor: '#e9f2ff', borderRadius: '12px' }),
              '& .css-1ir50m8-MuiTabs-indicator': {
                bgcolor: 'transparent'
              }
            }}
            label={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  ...(value === 1 && { color: '#0c66e4' })
                }}
              >
                <HomeOutlinedIcon />
                Home
              </Box>
            }
            {...a11yProps(0)}
          /> */}
          <hr style={{ width: '100%' }} />
        </Tabs>
      </Grid>
      <Grid item md={9} sx={{ padding: { xs: 1, md: '40px 0px 0px 0px' } }}>
        <TabPanel value={value} index={0}>
          <Boards />
        </TabPanel>
        {/* <TabPanel value={value} index={1}>
          <HomeNoti />
        </TabPanel> */}
      </Grid>
    </Grid>
  )
}

export default Home
