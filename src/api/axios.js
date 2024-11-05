import axios from 'axios';

const BASEURL = process.env.BASEURL || "http://localhost:8080";

export const API = axios.create({
    baseURL: BASEURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export const FORMAPI = axios.create({
    baseURL: BASEURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
    
  export const setRccToken = (access) => {
    API.defaults.headers["Authorization"] = `Bearer ${access}`;
    FORMAPI.defaults.headers["Authorization"] = `Bearer ${access}`;
  };
  
  export const removeRccAccess = () => {
    delete API.defaults.headers["Authorization"];
    delete FORMAPI.defaults.headers["Authorization"];
  };
  
  export const getRccAccess = () =>
    `${API.defaults.headers["Authorization"]}`;
  