import {$host} from "./index";

export const getSecondary = async () => {
    const {data} = await $host.get(`https://ten:5000/api/utils`)
    return data
}