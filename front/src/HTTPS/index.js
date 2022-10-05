import axios from 'axios'
// import {refresh} from "./userAPI";

const $host = axios.create({
    // baseURL: process.env.REACT_APP_API_URL
})

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const $citiesHost = axios.create({
    baseURL: process.env.REACT_APP_CITIESAPI_URL
})

const $statesHost = axios.create({
    baseURL: process.env.REACT_APP_STATESAPI_URL
})

const $countriesHost = axios.create({
    baseURL: process.env.REACT_APP_COUNTRIESAPI_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('access_token')}`
    config.headers.accept = `application/json`

    return config
}
//
// $authHost.interceptors.request.use(authInterceptor)
// $authHost.interceptors.response.use((config) => {return config}, async (error) => {
//     const originalRequest = error.config
//     if (error.response.status == 401){
//         try {
//             if (localStorage.getItem('refresh_token')) {
//                 await refresh()
//                 return $authHost.request(originalRequest)
//             }
//             else {
//                 localStorage.clear()
//                 window.location.href = '/login';
//             }
//         } catch (e){
//             localStorage.clear()
//             window.location.href = '/login';
//         }
//     }
//     else {
//         return error.response
//     }
// })

export {
    $host,
    $authHost,
    $citiesHost,
    $countriesHost,
    $statesHost
}