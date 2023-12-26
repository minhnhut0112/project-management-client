import axios from 'axios'
import { API_ROOT } from './constants'

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: `${API_ROOT}/`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const http = new Http().instance

export default http
