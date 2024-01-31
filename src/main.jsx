import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Provider } from 'react-redux'
import { store } from './redux/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider>
          <CssBaseline />
          <Provider store={store}>
            <App />
          </Provider>
          <ToastContainer position='bottom-right' />
        </ConfirmProvider>
      </CssVarsProvider>
    </LocalizationProvider>
  </QueryClientProvider>
)
