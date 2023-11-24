import { ReactNode, createContext, useEffect, useState } from 'react';

import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser'

import { api } from '@services/api';
import { UserDTO } from '@dtos/UserDTO';


export type AuthContextDataProps = {
    user: UserDTO;
    SignIn: ( email: string, password: string ) => Promise<void>;
    signOut:() => Promise<void>;
    isLoadingUseStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps ){
    
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUseStorageData, setIsLoadingStorageData] = useState(true);

  async function SignIn(email: string, password: string){

    try{
      const { data } = await api.post('/sessions', { email, password });
        
        if( data.user ){
          setUser(data.user);
          storageUserSave(data.user);
        }
      } catch(error){
        throw error;
      }
  }

  async function signOut(){
    try{
      setIsLoadingStorageData(true);

      setUser({} as UserDTO);
      await storageUserRemove();

    } catch (error){
      throw error;
    } finally{
      setIsLoadingStorageData(false)
    }
  }

  async function loadUserData(){
    try{
    const userLogged = await storageUserGet();

    if(userLogged){
      setUser(userLogged);
      setIsLoadingStorageData(false);
    }
  } catch(error){
    throw error;
  } finally{
      setIsLoadingStorageData(false);
    }

  }

  useEffect(() => {
    loadUserData();
  }, []);



  return(
    <AuthContext.Provider value = {{ 
      user, 
      SignIn,
      signOut,
      isLoadingUseStorageData
      }}>
      { children }
    </AuthContext.Provider>
  );
}