import AppBar from '@/components/AppBar/AppBar'
import BoardBar from '@/pages/Boards/BoardBar/BoardBar'

const BoardLayout = ({ children }) => {
  return (
    <div>
      <AppBar />
      <BoardBar />
      <div>{children}</div>
    </div>
  )
}

export default BoardLayout
