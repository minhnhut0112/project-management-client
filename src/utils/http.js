import axios from 'axios'
import { API_ROOT } from './constants'
import { jwtDecode } from 'jwt-decode'
// import { toast } from 'react-toastify'

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: `${API_ROOT}/`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // this.instance.interceptors.request.use(async (config) => {
    //   let currenrTime = new Date()
    //   const toekn = localStorage.getItem('accesstoken')
    //   const decodeToken = jwtDecode(toekn)
    //   if(decodeToken.exp < currenrTime.getTime() / 100 * 10 ) {
    //     const res = await
    //   }
    // })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status) {
          // toast.error(error.response.data.message)
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
