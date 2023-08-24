import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://192.168.3.4:3333'
});

api.interceptors.response.use(response=> response, error => {
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message));
    } else {
        return Promise.reject(new AppError("Erro no servidor, Tente nocmente mais tarde."));
    }
});

export { api };     




/* Dados recebidos
export { api };

api.interceptors.response.use((response)=>{
    console.log('INTERCEPTOR=>',response);
    return response;
}, (error)=>{
    console.log('INTERCEPTOR=>',error);
    return Promise.reject(error);
});
    
export { api };
*/



/*DADOS ENVIADOS 
request.use((config) => {
    console.log("DADOS ENVIADOS =>", config.data)
    return config;

}, (error) => {
    return Promise.reject(error)    

})

export { api };*/