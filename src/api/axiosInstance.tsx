import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-base-url.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
  }
});

export default axiosInstance;
