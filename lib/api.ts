import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
});