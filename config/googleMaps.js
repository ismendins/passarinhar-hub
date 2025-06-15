const { Client } = require('@googlemaps/google-maps-services-js');

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const googleMapsClient = new Client({});

module.exports = googleMapsClient;