import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.53:3333"
});

api.interceptors.response.use(response => response, error => {
  if(error.response && error.response.data){
    return Promise.reject(new AppError(error.reponse.data.message));
  } else{
    return Promise.reject(new AppError(error.message || "Erro desconhacido"));
  }
}); 

export { api };

