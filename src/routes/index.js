import SignIn from '@/pages/Auth/SignIn'
import SignUp from '@/pages/Auth/SignUp'
import Board from '@/pages/Boards/Board'
import Home from '@/pages/Home/Home'
import NotFound from '@/pages/NotFound'

const routes = [
  { path: '/', component: Home },
  { path: '/board/:id', component: Board },
  { path: '/sign-in', component: SignIn, layout: null },
  { path: '/sign-up', component: SignUp, layout: null },
  { path: '/*', component: NotFound, layout: null }
]

export { routes }
