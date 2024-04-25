import ConfirmSignIn from '@/pages/Auth/ConfirmSignIn'
import ConfirmSignUp from '@/pages/Auth/ConfirmSignUp'
import SignIn from '@/pages/Auth/SignIn'
import SignUp from '@/pages/Auth/SignUp'
import Board from '@/pages/Boards/Board'
import Table from '@/pages/Table/Table'
import DashBoard from '@/pages/DashBoard/DashBoard'
import Home from '@/pages/Home/Home'
import Issue from '@/pages/Issues/Issues'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile/Profile'
import BoardLayout from '@/components/Layout/BoardLayout'

const routes = [
  { path: '/', component: Home },
  { path: '/profile', component: Profile },

  { path: '/table/:id', component: Table, layout: BoardLayout },
  { path: '/dashboard/:id', component: DashBoard, layout: BoardLayout },
  { path: '/board/:id', component: Board, layout: BoardLayout },
  { path: '/issue/:id', component: Issue, layout: BoardLayout },

  { path: '/board/:id/card/:cardId', component: Board, layout: BoardLayout },

  { path: '/login', component: ConfirmSignIn, layout: null },
  { path: '/signup', component: ConfirmSignUp, layout: null },

  { path: '/sign-in', component: SignIn, layout: null },
  { path: '/sign-up', component: SignUp, layout: null },
  { path: '/*', component: NotFound, layout: null }
]

export { routes }
