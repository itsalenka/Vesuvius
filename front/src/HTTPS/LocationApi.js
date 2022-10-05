import {$host} from "./index";

export const sendLocation = async (latitude, longitude) => {
    const {data} = await $host.post(`https://ten:5000/api/location`, {latitude, longitude});
    return data;
}