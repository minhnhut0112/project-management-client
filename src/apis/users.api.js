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

export const findUsersAPI = async (email) => {
  const res = await http.post('v1/users/finduser', email)
  return res.data
}

export const updateStarredBoardAPI = async (userId, boardId) => {
  const res = await http.post(`v1/users/starred/${userId}`, boardId)
  return res.data
}

export const removeStarredBoardAPI = async (userId, boardId) => {
  const res = await http.put(`v1/users/starred/${userId}`, boardId)
  return res.data
}

export const getStarredBoard = async (userId) => {
  const res = await http.get(`v1/users/starred/${userId}`)
  return res.data
}

export const updateRecentBoardAPI = async (userId, boardId) => {
  const res = await http.post(`v1/users/recent/${userId}`, boardId)
  return res.data
}

export const getRecentBoard = async (userId) => {
  const res = await http.get(`v1/users/recent/${userId}`)
  return res.data
}
