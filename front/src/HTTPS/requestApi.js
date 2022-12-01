import {$authHost} from "./index";

export const getMyRequests = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/requests/user`)
    return data
}

export const createRequest = async (request) => {
    const {dateLoading, dateUnloading, WRCountry, WCountry, WRState, WState, WRCity, WCity, WRAddress, WAddress, weight, volume, typeLoading, typeUnloading, cargo, rate, note, typeTruck, ADR, loadLimit} = request
    const {data} = await $authHost.post(`https://ten:5000/api/requests`, {dateLoading, dateUnloading, WRCountry, WCountry, WRState, WState, WRCity, WCity, WRAddress, WAddress, weight, volume, typeLoading, typeUnloading, cargo, rate, note, typeTruck, ADR, loadLimit})
    return data
}

export const getRequest = async (id) => {
    const {data} = await $authHost.get(`https://ten:5000/api/requests/${id}`)
    return data
}

export const updateRequest = async (id, body) => {
    const {data} = await $authHost.put(`https://ten:5000/api/requests/${id}`, body)
    return data
}

export const deleteRequest = async (id) => {
    const {data} = await $authHost.delete(`https://ten:5000/api/requests/${id}`)
    return data
}