// src/api/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default API;
