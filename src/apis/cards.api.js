import http from '@/utils/http'

export const createNewCardAPI = async (newCardData) => {
  const res = await http.post('v1/cards', newCardData)
  return res.data
}

export const updateCardAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}`, data)
  return res.data
}

export const changeCoverAPI = async (id, data) => {
  const res = await http.post(`v1/cards/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const unsetFieldAPI = async (id, field) => {
  const res = await http.post(`v1/cards/removeItem/${id}`, { field })
  return res.data
}

export const cardUploadFileAPI = async (id, data) => {
  const res = await http.post(`v1/cards/${id}/upload`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const deleteCardAPI = async (id) => {
  const res = await http.delete(`v1/cards/${id}`)
  return res.data
}
