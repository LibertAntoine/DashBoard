import axios from "axios"

export const openMapApi = axios.create({ baseURL: `http://api.openweathermap.org/data/2.5/` });

export const ipgeolocationApi = axios.create({ baseURL: `https://api.ipgeolocation.io/` });
