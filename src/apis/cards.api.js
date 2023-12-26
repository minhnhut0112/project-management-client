import http from '@/utils/http'

export const createNewCardAPI = async (newCardData) => {
  const res = await http.post('v1/cards', newCardData)
  return res.data
}
