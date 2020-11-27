# :bar_chart: Dashboard

 ![Dashboard](doc/readme-img/Dashboard.png?raw=true "Dashboard")

## Table of Contents

- [**Building configuration**](#Building-configuration)
  * [**Clone repository**](#clone-repository)
  * [**Complete env file**](#complete-env-file)
  * [**Launch local frontend**](#launch-local-frontend)
  * [**Build frontend**](#build-frontend)

- [**Presentation**](#presentation)

- [**Main Features**](#main-features)

- [**Contributors**](#contributors)

- [**Dependencies**](#dependencies)


## Building configuration 
You need [Node.js](https://nodejs.org) to launch this project.
### Clone repository 
In the local folder for the project
```bash
git clone https://github.com/LibertAntoine/DashBoard.git
```
### Complete env file
This project need env variable. You can use and rename .env.sample file to .env et complete it : 
* VUE_APP_APIKEY=key => key for access of the Dark sky API https://darksky.net/dev

### Launch local frontend
In the Node Command Prompt, in the project folder
```bash
npm install
npm run serve
```

### Build frontend
In the Node Command Prompt, in the project folder
```bash
npm install
npm run build
```
The build forder is dist.

## Presentation
<p>
Web application offering a weather dashboard. Temperature, wind and humidity information for a chosen geographic area can be viewed via an aesthetic and simple interface, either by entering the name of a city or a location directly on the map. The application can also identify the user's location. This project aims at the production of data visualization elements using various javascript libraries. The application is based on a Vue.js frontend.
</p>
<p>
This project is an initiative resulting from a lecture about framework frontend at the IMAC engineering school.
</p>

Realized in May 2020.

[**See website**](https://dashboard.antoine-libert.com/)

[**More details... (FR)**](doc/Weather-Board-Rapport.pdf)

<p align="center">
<img src="doc/readme-img/Dashboard2.png?raw=true" width="45%" alt="Screenshot">
<img src="doc/readme-img/Dashboard3.png?raw=true" width="45%" alt="Screenshot">
</p>


## Main Features
* 	Responsive application with Vue.js.
* 	Use of the vue-graphJs, Plotly, D3.js libraries for data visualization.

## Contributors
* [**Antoine Libert**](https://github.com/LibertAntoine)  – Web architecture, API
* [**Nicolas Lienart**](https://github.com/nicolnt) – Datavisualisation.
* [**Enguerrand De Smet**](https://github.com/dsmtE) - Datavisualisation.
* [**Margaux Vaillant**](https://github.com/Margaux2812) – Style, responsive.



## Dependencies
- [**Axios**](https://www.npmjs.com/package/axios) - For API requests.
- [**semantic-ui**](https://www.npmjs.com/package/semantic-ui-vue) - For styles.
- [**chart.js**](https://www.npmjs.com/package/chart.js) - For datavisualisation.
- [**d3**](https://www.npmjs.com/package/d3) -For datavisualisation.
- [**vue-plotly**](https://www.npmjs.com/package/vue-plotly) - For datavisualisation.


