import {$authHost, $host} from "./index";
import jwt_decode from 'jwt-decode'

export const registration = async (formValues) => {
    const {email, password, role, nameCompany, name, director, phoneNumber, country, state,  city, bankInfo, address, passwordRep} = formValues
    const {data} = await $host.post('https://ten:5000/api/users/registration', {email, password, name, role, nameCompany, director, phoneNumber, country, state,   city, bankInfo, address, passwordRep})
    return data
}

export const login = async (formValues) => {
    const {email, password} = formValues
    const {data} = await $host.post('https://ten:5000/api/users/login', {email, password})//, {    withCredentials: true})
    const dataDecode = jwt_decode(data.accessToken)
    localStorage.setItem('access_token',  data.accessToken)
    localStorage.setItem('refresh_token',  data.refreshToken)
    localStorage.setItem('user_role', dataDecode.role)
    localStorage.setItem('user_id', dataDecode.id)
    return dataDecode
}

export const updateUser = async (formValues) => {
    const {email, name, phoneNumber, passwordOld, password, passwordRep} = formValues
    const {data} = await $authHost.put(`https://ten:5000/api/users`, {email, name, phoneNumber, passwordOld, password, passwordRep})
    return data
}

export const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    const {data} = await $authHost.post('https://ten:5000/api/users/logout', {refreshToken})
    return data
}

export const getInfo = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/users/my`)
    return data
}

export const refresh = async () => {
    const {data} = await $host.get('https://ten:5000/api/users/refresh', {headers: {Authorization: `Baerer ${localStorage.getItem('refresh_token')}`}})

    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken)
    return data
}

export const auth = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/users/auth`)
    return data
}

export const getMyDrivers = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/users/drivers`)
    return data
}

export const getDriver = async (id) => {
    const {data} = await $authHost.get(`https://ten:5000/api/users/drivers/` + id)
    return data
}

export const createDriver = async (formValues) => {
    const {name, email, phoneNumber, password, passwordRep} = formValues
    const {data} = await $authHost.post(`https://ten:5000/api/users/drivers`, {role: 'DRIVER', name, email, phoneNumber, password, passwordRep})
    return data
}

export const deleteDriver = async (id) => {
    const {data} = await $authHost.delete(`https://ten:5000/api/users/drivers/` + id)
    return data
}

export const getFreeDrivers = async (dateLoad, dateUnload) => {
    const {data} = await $authHost.post(`https://ten:5000/api/users/drivers/free`, {dateLoad, dateUnload})
    return data
}

