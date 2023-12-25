import { API_ROOT } from '@/utils/constants'
import axios from 'axios'

export const fetchAllBoardsAPI = async () => {
  const res = await axios.get(`${API_ROOT}/v1/boards/`)
  return res.data
}
export const createBoardAPI = async (data) => {
  const res = await axios.post(`${API_ROOT}/v1/boards/`, data)
  return res.data
}

export const fetchBoardDetailsAPI = async (boardId) => {
  const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return res.data
}

export const moveColumnAPI = async (id, data) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/${id}`, data)
  return res.data
}

export const moveCardToDifferentColunmnAPI = async (data) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/support/moving_card`, data)
  return res.data
}
