import { useColorScheme } from '@mui/material/styles'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'

const ModeSelect = () => {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    const selectMode = event.target.value
    setMode(selectMode)
  }
  return (
    <>
      <FormControl sx={{ minWidth: 130, mt: 0.5 }} size='small'>
        <InputLabel
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            '&.Mui-focused': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            }
          }}
          id='lable-select-mode'
        >
          Mode
        </InputLabel>
        <Select
          labelId='lable-select-mode'
          id='select-mode'
          value={mode}
          onChange={handleChange}
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D'),
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            },
            '.MuiSvgIcon-root': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#172B4D')
            }
          }}
          autoWidth
          label='Mode'
        >
          <MenuItem value='light'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightModeOutlinedIcon fontSize='small' />
              Light
            </Box>
          </MenuItem>
          <MenuItem value='dark'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeOutlinedIcon fontSize='small' />
              Dark
            </Box>
          </MenuItem>
          <MenuItem value='system'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsBrightnessOutlinedIcon fontSize='small' />
              System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

export default ModeSelect
