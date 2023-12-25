import { API_ROOT } from '@/utils/constants'
import axios from 'axios'

export const createNewCardAPI = async (newCardData) => {
  const res = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return res.data
}
