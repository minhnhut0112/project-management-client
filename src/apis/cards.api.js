import http from '@/utils/http'

export const createNewCardAPI = async (newCardData) => {
  const res = await http.post('v1/cards', newCardData)
  return res.data
}

export const updateCardAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}`, data)
  return res.data
}

export const deleteCardAPI = async (id) => {
  const res = await http.delete(`v1/cards/${id}`)
  return res.data
}

export const updateCoverAPI = async (id, data) => {
  const res = await http.post(`v1/cards/${id}/cover`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const removeCoverAPI = async (id) => {
  const res = await http.delete(`v1/cards/${id}/cover`)
  return res.data
}

export const updateDatesAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}/dates`, data)
  return res.data
}

export const removeDatesAPI = async (id) => {
  const res = await http.delete(`v1/cards/${id}/dates`)
  return res.data
}

export const uploadAttachmentsAPI = async (id, data) => {
  const res = await http.post(`v1/cards/${id}/attachments`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const removeAttachmentsAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}/attachments`, data)
  return res.data
}

export const cardUploadFileAPI = async (id, data) => {
  const res = await http.post(`v1/cards/file/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const cardDeleteFileAPI = async (id, data) => {
  const res = await http.put(`v1/cards/file/${id}`, data)
  return res.data
}

export const createChecklistAPI = async (id, data) => {
  const res = await http.post(`v1/cards/${id}/checklist`, data)
  return res.data
}

export const updateCheckListAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}/checklist`, data)
  return res.data
}

export const createCommentstAPI = async (id, data) => {
  const res = await http.post(`v1/cards/${id}/comments`, data)
  return res.data
}
