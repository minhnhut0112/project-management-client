import http from '@/utils/http'

export const createNewCardAPI = async (newCardData) => {
  const res = await http.post('v1/cards', newCardData)
  return res.data
}

export const updateCardAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}`, data)
  return res.data
}
