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
            color: 'white',
            '&.Mui-focused': {
              color: 'white'
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
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            },
            '.MuiSvgIcon-root': {
              color: 'white'
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
