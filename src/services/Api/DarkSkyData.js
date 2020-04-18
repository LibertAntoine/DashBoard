const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = process.env.VUE_APP_APIKEY_DARKSKY;
const WEATHER_API_URL = `${proxy}https://api.darksky.net/forecast/${API_KEY}/`;
const GEO_API_URL = `${proxy}https://darksky.net/geo?q=`;
const ADDRESS_API_URL = `${proxy}https://darksky.net/rgeo?hires=1`;

export default {
  getAddress: async (lat, lng) => (await fetch(`${ADDRESS_API_URL}&lat=${lat}&lon=${lng}`)).json(),
  getForecast: async (lat, lng) => (await fetch(`${WEATHER_API_URL}${lat},${lng}`)).json(),
  getCoordinates: async (location) => (await fetch(`${GEO_API_URL}${location}`)).json(),
  getEmbedURL: (lat, lng) => `https://maps.darksky.net/@temperature,${lat},${lng},6?domain="+encodeURIComponent(window.location.href)+"&auth=1525213550_b5fc128e7789bb56048952cc704c8473&embed=true&amp;timeControl=false&amp;fieldControl=false;`,
};