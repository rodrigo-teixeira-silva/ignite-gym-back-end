import { ReactNode, createContext, useState } from 'react';

import { api } from '@services/api';

import { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
    user: UserDTO;
    SignIn: (email: string, password: string) => Promise <void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps ){
    
    const [user, setUser] = useState<UserDTO>({} as UserDTO);

    async function SignIn(email: string, password: string){

        try{
            const { data } = await api.post('/session',{ email, password
            });

            if(data.user ){
                setUser(data.user);
            }
        } catch(error){
            throw error;
        }
    }


    return(
        <AuthContext.Provider value={{ user, SignIn }}>
            {children}
        </AuthContext.Provider>
    );
}