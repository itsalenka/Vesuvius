import {$host, $citiesHost, $countriesHost, $statesHost} from "./index";

// export const getAllCities = async () => {
//     const {data} = await $host.get(`/api/city`)
//     return data
// }

export const getCities = async (country, state) => {
    const {data} = await $citiesHost.post('', {country, state})
    if (data.error === true)
        throw new Error('cities api error')
    console.log(data.data)
    return data.data
}

export const getStates = async (country) => {
    const {data} = await $statesHost.post('', {country})
    const result = []
    if (data.error === true)
        throw new Error('states api error')
    const states = data.data.states;
    states.forEach((state) => {
        result.push(state.name);
    })
    return result
}


export const getCountries = async () => {
    const {data} = await $countriesHost.get('')
    const result = []
    if (data.error === true)
        throw new Error('countries api error')
    data.data.forEach((country) => {
        result.push(country.name);
    })

    return result
}