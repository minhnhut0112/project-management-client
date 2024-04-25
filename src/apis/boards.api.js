import http from '@/utils/http'

export const fetchAllBoardsAPI = async (userId) => {
  const res = await http.get(`v1/boards/getAll/${userId}`)
  return res.data
}
export const createBoardAPI = async (data) => {
  const res = await http.post('v1/boards/', data)
  return res.data
}

export const fetchBoardDetailsAPI = async (boardId) => {
  const res = await http.get(`v1/boards/${boardId}`)
  return res.data
}

export const updateBoardAPI = async (id, data) => {
  const res = await http.put(`v1/boards/${id}`, data)
  return res.data
}

export const moveCardToDifferentColunmnAPI = async (data) => {
  const res = await http.put('v1/boards/support/moving_card', data)
  return res.data
}

export const sendInviteEmailAPI = async (data) => {
  const res = await http.post('v1/boards/invite', data)
  return res.data
}

export const confirmInviteEmailAPI = async (id) => {
  const res = await http.put(`v1/boards/invite/${id}`)
  return res.data
}

export const getInviteAPI = async (id) => {
  const res = await http.get(`v1/boards/invite/${id}`)
  return res.data
}

export const editLabelAPI = async (id, data) => {
  const res = await http.put(`v1/boards/${id}/labels`, data)
  return res.data
}

export const createNewLabelAPI = async (id, data) => {
  const res = await http.post(`v1/boards/${id}/labels`, data)
  return res.data
}

export const removeLabelAPI = async (id, labelId, cardId) => {
  const res = await http.delete(`v1/boards/${id}/labels?labelId=${labelId}&cardId=${cardId}`)
  return res.data
}

export const changeToAdminAPI = async (id, userId) => {
  const res = await http.put(`v1/boards/${id}/permission`, { userId })
  return res.data
}

export const changeToMemberAPI = async (id, userId) => {
  const res = await http.post(`v1/boards/${id}/permission`, { userId })
  return res.data
}

export const removeFromBoardlAPI = async (id, userId) => {
  const res = await http.delete(`v1/boards/${id}/permission?userId=${userId}`)
  return res.data
}

export const uploadCoverAPI = async (id, data) => {
  const res = await http.post(`v1/boards/${id}/cover`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const createNewIssueAPI = async (id, data) => {
  const res = await http.post(`v1/boards/${id}/issues`, data)
  return res.data
}

export const updateIssueAPI = async (id, data) => {
  const res = await http.put(`v1/boards/${id}/issues`, data)
  return res.data
}

export const editIssueAPI = async (id, data) => {
  const res = await http.patch(`v1/boards/${id}/issues`, data)
  return res.data
}
