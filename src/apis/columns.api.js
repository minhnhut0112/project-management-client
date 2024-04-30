import http from '@/utils/http'

export const createNewColumnAPI = async (newColumnData) => {
  const res = await http.post('v1/columns', newColumnData)
  return res.data
}

export const deleteColumnAPI = async (id) => {
  const res = await http.delete(`v1/columns/${id}`)
  return res
}

export const updateColumnAPI = async (id, data) => {
  const res = await http.put(`v1/columns/${id}`, data)
  return res.data
}

export const archiveAllCardAPI = async (id) => {
  const res = await http.put(`v1/columns/archive/${id}`)
  return res.data
}
