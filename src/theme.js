import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const App_Bar_Height = '60px'
const Board_Bar_Height = '60px'
const Board_Content_Height = `calc(100vh - ${App_Bar_Height} - ${Board_Bar_Height})`
const Board_Height = `calc(100vh - ${App_Bar_Height})`
const Column_Header_Height = '50px'
const Column_Footer_Height = '56px'

const theme = extendTheme({
  todolist: {
    appBarHeight: App_Bar_Height,
    boardBarHeight: Board_Bar_Height,
    boardContentHeight: Board_Content_Height,
    boardHeight: Board_Height,
    columnHeaderHeight: Column_Header_Height,
    columnFooterHeight: Column_Footer_Height
  },
  // colorSchemes: {
  //   light: {
  //     palette: {
  //       primary: teal,
  //       secondary: deepOrange
  //     }
  //   },
  //   dark: {
  //     palette: {
  //       primary: cyan,
  //       secondary: orange
  //     }
  //   }
  // },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            backgroundColor: '#dcdde1'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontsize: '0.875rem',
          '& fieldset': {
            borderWidth: '1px !important'
          },
          '&:hover fieldset': {
            borderWidth: '2px !important'
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px !important'
          }
        }
      }
    }
  }
})

export default theme
