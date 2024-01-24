import axios from 'axios'
import { API_ROOT } from './constants'

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: `${API_ROOT}/`,
      timeout: 10000
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          if (error.response.status) {
            // toast.error(error.response.data.message)
          } else {
            // toast.error('Something wrong!')
          }
        } else {
          // toast.error('Something wrong!')
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
