import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


// export const HOST_URL = 'http://103.20.215.109/plesk-site-preview/assetnodeapi.mssplonline.com/';

export const HOST_URL = 'http://localhost:5000/';

//export const HOST_URL = 'http://192.168.1.113:3000/api/';




const api = axios.create({
  baseURL: HOST_URL,
});

api.interceptors.request.use(
  (config) => {
    const tokenWithQuotes = sessionStorage.getItem('token');

const token = tokenWithQuotes?.replace(/^"(.*)"$/, '$1');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      
      Logout();
    }
    return Promise.reject(error);
  }
);

function Logout() {
  
  localStorage.clear();
  sessionStorage.clear();
  //toast.success("Token expired. Logging out...");
  const navigate=useNavigate();
  navigate("/");
}


export default api;


