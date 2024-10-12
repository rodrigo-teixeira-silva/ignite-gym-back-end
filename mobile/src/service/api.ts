import axios, { AxiosInstance } from "axios";

import { AppError} from "@utils/AppError";
import { storageAuthTokenGet } from "@storage/storageAuthToken";
// import { storageAuthTokenGet } from "@storage/storageAuthToken";

type SignOut = () => void;

type APIIntanceProps = AxiosInstance & {
  registerInterceptTokenManager: (SignOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://192.168.100.58:3333"
}) as APIIntanceProps;

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

