import { API_ROOT } from '@/utils/constants'
import axios from 'axios'

export const fetchBoardDetailsAPI = async (boardId) => {
  const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return res.data
}

export const createNewColumnAPI = async (newColumnData) => {
  const res = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return res.data
}

export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return res.data
}

export const moveColumnAPI = async (id, data) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/${id}`, data)
  return res.data
}

export const deleteColumnAPI = async (id) => {
  const res = await axios.delete(`${API_ROOT}/v1/columns/${id}`)
  return res
}

export const moveCardInTheSameColumnAPI = async (id, data) => {
  const res = await axios.put(`${API_ROOT}/v1/columns/${id}`, data)
  return res.data
}

export const moveCardToDifferentColunmnAPI = async (data) => {
  const res = await axios.put(`${API_ROOT}/v1/boards/support/moving_card`, data)
  return res.data
}
