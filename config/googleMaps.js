const dotenv = require('dotenv').config();
const axios = require('axios');

const MAPS_API_KEY = process.env.MAPS_API_KEY;
const url_mapas = process.env.url_mapas;

const googleMapsApi = {
    baseUrl: url_mapas,
    api_key: MAPS_API_KEY,
}

module.exports = googleMapsApi;