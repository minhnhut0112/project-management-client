import http from '@/utils/http'

export const signinUserAPI = async (user) => {
  const res = await http.post('v1/users/signin', user)
  return res.data
}
