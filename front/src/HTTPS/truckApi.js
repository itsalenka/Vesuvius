import {$authHost} from "./index";

export const createTruck = async (formValues) => {
    const {maxWeight, maxVolume, number, brand, model, year, typeTruck, isPearLoading, isSideLoading, isUpLoading, notes} = formValues
    const {data} = await $authHost.post(`https://ten:5000/api/trucks`, {maxWeight, maxVolume, number, brand, model, year, typeTruck, isPearLoading, isSideLoading, isUpLoading, notes})
    return data
}

export const updateTruck = async (id, truck) => {
    const {data} = await $authHost.put(`https://ten:5000/api/trucks/${id}`, truck)
    return data
}

export const getTruck = async (id) => {
    const {data} = await $authHost.get(`https://ten:5000/api/trucks/${id}`)
    return data
}

export const getMyTrucks = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/trucks/user`)
    return data
}

export const deleteTruck = async (id) => {
    const {data} = await $authHost.delete(`https://ten:5000/api/trucks/${id}`)
    return data
}

export const getFreeTrucks = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/trucks/free`)
    return data
}