import { API_ROOT } from '@/utils/constants'
import axios from 'axios'

export const createNewColumnAPI = async (newColumnData) => {
  const res = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return res.data
}

export const deleteColumnAPI = async (id) => {
  const res = await axios.delete(`${API_ROOT}/v1/columns/${id}`)
  return res
}

export const updateColumnAPI = async (id, data) => {
  const res = await axios.put(`${API_ROOT}/v1/columns/${id}`, data)
  return res.data
}
