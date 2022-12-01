import {$authHost} from "./index";

export const updateCompany = async (formValues) => {
    const {director, bankInfo, country, state, city, address} = formValues
    const {data} = await $authHost.put(`https://ten:5000/api/companies`, {director, country, state, city, bankInfo, address})
    return data
}

export const getDrivers = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/companies/drivers`)
    return data
}

export const getTrucks = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/companies/trucks`)
    console.log(data)
    return data
}

export const getInfo = async () => {
    const {data} = await $authHost.get(`https://ten:5000/api/companies/my`)
    return data
}
