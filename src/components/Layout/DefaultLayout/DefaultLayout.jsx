import AppBar from '@/components/AppBar/AppBar'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <AppBar />
      <div>{children}</div>
    </div>
  )
}

export default DefaultLayout
