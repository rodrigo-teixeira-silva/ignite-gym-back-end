import axios, { AxiosInstance, AxiosError } from "axios";

import { AppError} from "@utils/AppError";
import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";
import { err } from "react-native-svg/lib/typescript/xml";
// import { storageAuthTokenGet } from "@storage/storageAuthToken";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIIntanceProps = AxiosInstance & {
  registerInterceptTokenManager: (SignOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://192.168.100.58:3333"
}) as APIIntanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = SignOut => {
  const interceptTokenManager = api.interceptors.response.use(
    response => response, async (requestError) => {

      if(requestError?.response?.status === 401){
        if(requestError.response.data.message === 'token.expired' || requestError.response.data?.message === 'token.invalid'){
            const {refresh_token } = await storageAuthTokenGet();

            if(!refresh_token){
              SignOut();
              return Promise.reject(requestError);
            }

            const originalRequestConfig  = requestError.config;
           // console.log('REQUISIÇÃO =>', originalRequestConfig); 

           if(isRefreshing){
            return new Promise((resolver, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {'Autorization':`Bearer ${token}` }
                  resolver(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              })
            });
          }
            isRefreshing = true;

            return new Promise(async (resolve, reject)=>{
              try {
               const { data } = await api.post('/sessions/refresh-token', {refresh_token});
               await storageAuthTokenSave({token: data.token, refresh_token:data.refresh_token});
               //   console.log('Token atualizado', data);

                if(originalRequestConfig.data){
                  originalRequestConfig.data = JSON.parse(originalRequestConfig.data);          
                }

                originalRequestConfig.headers = {'Autorization' :`Bearer ${data.token}}` }
                api.defaults.headers.common['Autorization'] = `Bearer ${data.token}`;

                failedQueue.forEach(request => {
                  request.onSuccess(data.token);
                });

                console.log("TOKEN ATULAIZADO!"); 
                resolve(api(originalRequestConfig));

              } catch (error: any) {
                failedQueue.forEach(request => {
                  request.onFailure(error);
                  });

                  SignOut();
                  reject(error);
              } finally {
                isRefreshing = false;
                failedQueue = [];
              }
            });

        }

        SignOut();
      }



      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(new AppError(requestError.message));
  
      }
    });

    return () => {
      api.interceptors.response.eject(interceptTokenManager);
    };
};


export { api };

