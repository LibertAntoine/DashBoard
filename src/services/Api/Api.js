import axios from "axios"

export const ipgeolocationApi = axios.create({ baseURL: `https://api.ipgeolocation.io/` });
