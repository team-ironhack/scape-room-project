const axios = require('axios');

const httpClient = axios.create({
    baseURL: 'http://localhost:8000'
})

module.exports = httpClient;