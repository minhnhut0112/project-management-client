import http from '@/utils/http'

export const fetchAllBoardsAPI = async () => {
  const res = await http.get('v1/boards/')
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

export const moveColumnAPI = async (id, data) => {
  const res = await http.put(`v1/boards/${id}`, data)
  return res.data
}

export const moveCardToDifferentColunmnAPI = async (data) => {
  const res = await http.put('v1/boards/support/moving_card', data)
  return res.data
}
