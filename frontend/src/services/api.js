import axios from 'axios';
// frontul trimite cerere prin portul 3000
const API = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export default API;
