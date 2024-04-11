import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import { Fragment, useEffect } from 'react'
import DefaultLayout from './components/Layout/DefaultLayout/DefaultLayout'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { getUserAPI } from './apis/users.api'
import { loginUser } from './redux/userSile'

function App() {
  const user = useSelector((state) => state.user.auth)

  const disPatch = useDispatch()

  const handleGetDetailsUser = async (id, accessToken) => {
    const res = await getUserAPI(id)
    disPatch(loginUser({ ...res, accessToken: accessToken }))
  }

  const handleDecode = () => {
    const accessToken = user?.accessToken || localStorage.getItem('accessToken')
    let currUser = ''
    if (accessToken) {
      currUser = jwtDecode(accessToken)
    }
    return { currUser, accessToken }
  }

  useEffect(() => {
    const { currUser, accessToken } = handleDecode()
    if (currUser) {
      handleGetDetailsUser(currUser.id, accessToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.component

            let Layout = DefaultLayout

            if (route.layout) {
              Layout = route.layout
            } else if (route.layout === null) {
              Layout = Fragment
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            )
          })}
        </Routes>
      </Router>
    </>
  )
}

export default App
