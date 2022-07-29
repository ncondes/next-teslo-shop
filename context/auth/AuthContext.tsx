import { createContext } from 'react';
import { IUser } from '../../interfaces';

interface ContextProps {
   isUserLoggedIn: boolean;
   user?: IUser;

   // Methods
   loginUser: (email: string, password: string) => Promise<boolean>;
   registerUser: (
      name: string,
      email: string,
      password: string
   ) => Promise<{
      hasError: boolean;
      message?: string;
   }>;
}

export const AuthContext = createContext({} as ContextProps);
