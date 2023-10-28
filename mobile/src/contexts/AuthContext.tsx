import { ReactNode, createContext, useState } from 'react';

import { UserDTO } from '@dtos/UserDTO';

export type AuthContextDataProps = {
    user: UserDTO;
}

type AuthContextProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps ){
    const [user, setUser] = useState({
        id:'1',
        usuario:"Rodrigo Teixeira",
        email:"rodrigo@gmail.com",
        avatar:"rodrigo.png"
    });

    return(
        <AuthContext.Provider value={{ user:user }}>
            {children}
        </AuthContext.Provider>
    );
}