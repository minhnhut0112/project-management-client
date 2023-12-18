// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '@/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    <ToastContainer position='bottom-right' />
  </CssVarsProvider>
  // </React.StrictMode>
)
