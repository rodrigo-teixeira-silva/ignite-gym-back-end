import { ReactNode, createContext, useEffect, useState } from 'react';

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken'

import { storageUserSave, storageUserRemove, storageUserGet} from '@storage/storageUser'

import { api } from '@services/api';

import { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
  user: UserDTO;
  SignIn: ( email: string, password: string ) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUseStorageData: boolean;

}

  type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps ){
    
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUseStorageData, setIsLoadingUserStorageData, ] = useState(true);

  async function userAndTokenUpdate (userData: UserDTO, token: string){
    api.defaults.headers.common['authorization'] = `Bearer ${token}`;
    setUser(userData);
  } 

  async function storageUserAndTokenSave(userData: UserDTO, token: string){
    
    try{
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    } catch (error){
      throw error;
    } finally{
      setIsLoadingUserStorageData(false);
    }
  }

  async function SignIn(email: string, password: string){

    try{

      const { data } = await api.post('/sessions', { email, password });
       
        if( data.user && data.token ){
        await storageUserAndTokenSave(data.user, data.token);
        userAndTokenUpdate(data.user, data.token);

        }
      } catch(error){
        throw error;
      } finally{
        setIsLoadingUserStorageData(false);
      }
  }

  async function signOut() {

    try {
      setIsLoadingUserStorageData(true);

      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally{
      setIsLoadingUserStorageData(false)
    }

  }

  async function loadUserData(){

    try{
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet(); 

      if(token && userLogged){
        userAndTokenUpdate(userLogged, token);
      }

    } catch(error){
      throw error;
    } 
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return(
    <AuthContext.Provider value={{ 
      user, 
      SignIn,
      signOut,
      isLoadingUseStorageData
      }}>
      {children}
    </AuthContext.Provider>
  );
}