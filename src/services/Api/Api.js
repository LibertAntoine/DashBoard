import axios from "axios";

export const openMapApi = axios.create({  baseURL: `http://api.openweathermap.org/` });

// export default () => {
//   return axios.create({ baseURL: `http://api.openweathermap.org/` });
// };
