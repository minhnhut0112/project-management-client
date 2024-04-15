import ConfirmSignIn from '@/pages/Auth/ConfirmSignIn'
import ConfirmSignUp from '@/pages/Auth/ConfirmSignUp'
import SignIn from '@/pages/Auth/SignIn'
import SignUp from '@/pages/Auth/SignUp'
import Board from '@/pages/Boards/Board'
import Home from '@/pages/Home/Home'
import NotFound from '@/pages/NotFound'
import Profile from '@/pages/Profile/Profile'

const routes = [
  { path: '/', component: Home },
  { path: '/board/:id', component: Board },
  { path: '/profile', component: Profile },

  { path: '/login', component: ConfirmSignIn, layout: null },
  { path: '/signup', component: ConfirmSignUp, layout: null },

  { path: '/sign-in', component: SignIn, layout: null },
  { path: '/sign-up', component: SignUp, layout: null },
  { path: '/*', component: NotFound, layout: null }
]

export { routes }
