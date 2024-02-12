import http from '@/utils/http'

export const signinUserAPI = async (user) => {
  const res = await http.post('v1/users/signin', user)
  return res.data
}

export const signupUserAPI = async (user) => {
  const res = await http.post('v1/users/signup', user)
  return res.data
}

export const getUserAPI = async (userId) => {
  const res = await http.get(`v1/users/${userId}`)
  return res.data
}

export const refreshTokenAPI = async () => {
  const res = await http.post('v1/users/refreshtoken')
  return res.data
}
