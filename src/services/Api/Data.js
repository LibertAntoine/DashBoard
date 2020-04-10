import Api from "./Api";

export default {
  getCity: async () => {
    return await Api().get("/data/2.5/weather?id=2172797", {
      params: {
        appid: process.env.VUE_APP_APIKEY,
      },
    });
  },
  getCity16days: async (city) => {
    return await Api().get("/data/2.5/forecast", {
      params: {
        appid: process.env.VUE_APP_APIKEY,
        q: city,
        mode: "json",
      },
    });
  },
};
