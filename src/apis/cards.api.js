import http from '@/utils/http'

export const createNewCardAPI = async (newCardData, access_token) => {
  const res = await http.post('v1/cards', newCardData, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const updateCardAPI = async (id, data) => {
  const res = await http.put(`v1/cards/${id}`, data)
  return res.data
}

export const fetchAllNotifications = async (userId) => {
  const res = await http.get(`v1/cards/${userId}/notifications`)
  return res.data
}

export const deleteCardAPI = async (id, access_token) => {
  const res = await http.delete(`v1/cards/${id}`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const updateCoverAPI = async (id, data, access_token) => {
  const res = await http.post(`v1/cards/${id}/cover`, data, {
    headers: { token: `Bearer ${access_token}`, 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const removeCoverAPI = async (id, access_token) => {
  const res = await http.delete(`v1/cards/${id}/cover`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const updateDatesAPI = async (id, data, access_token) => {
  const res = await http.put(`v1/cards/${id}/dates`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const removeDatesAPI = async (id, access_token) => {
  const res = await http.delete(`v1/cards/${id}/dates`, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const uploadAttachmentsAPI = async (id, data, access_token) => {
  const res = await http.post(`v1/cards/${id}/attachments`, data, {
    headers: { token: `Bearer ${access_token}`, 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const removeAttachmentsAPI = async (id, data, access_token) => {
  const res = await http.put(`v1/cards/${id}/attachments`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const createChecklistAPI = async (id, data, access_token) => {
  const res = await http.post(`v1/cards/${id}/checklist`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const updateCheckListAPI = async (id, data, access_token) => {
  const res = await http.put(`v1/cards/${id}/checklist`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}

export const createCommentstAPI = async (id, data, access_token) => {
  const res = await http.post(`v1/cards/${id}/comments`, data, {
    headers: {
      token: `Bearer ${access_token}`
    }
  })
  return res.data
}
