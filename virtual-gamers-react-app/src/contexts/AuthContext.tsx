import { AxiosError } from 'axios';
import React, {
  createContext, useContext, useState, ReactNode,
} from 'react';
import { apiGet, apiPost } from '../utils/apiUtil';
import { UserAccount } from '../types/UserAccount';
import { NODE_JS_SERVICE_API } from '../constants';

interface AuthContextType {
  userAccount: UserAccount | undefined;
  username: string | undefined;
  isAuthenticated: boolean;
  error: string | undefined;
  signIn: (credentials: { username: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  signUp: (user: { username: string; password: string; iconName: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  userAccount: undefined,
  username: undefined,
  isAuthenticated: false,
  error: undefined,
  signIn: async () => false,
  signOut: async () => false,
  signUp: async () => false,
});

// Provide Context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | undefined>(localStorage.getItem('username') || undefined);
  const userAccountAsStr = localStorage.getItem('userAccount');
  const userAccountParsed: UserAccount | undefined = userAccountAsStr
    ? JSON.parse(userAccountAsStr) as UserAccount : undefined;
  const [userAccount, setUserAccount] = useState<UserAccount | undefined>(userAccountParsed);
  const [accessToken, setAccessToken] = useState<string | undefined>(localStorage.getItem('accessToken') || undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError) {
      if (err.response && err.response.data && typeof err.response.data.message === 'string') {
        setError(err.response.data.message);
      } else if (typeof err.message === 'string') {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } else {
      setError('An unknown error occurred');
    }
  };

  const signUp = async (
    user: { username: string; password: string; iconName: string },
  ): Promise<boolean> => {
    try {
      await apiPost(`${NODE_JS_SERVICE_API}/user/signup`, user);
      setError(undefined);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  };

  const signIn = async (
    credentials: { username: string; password: string },
  ): Promise<boolean> => {
    try {
      const signInResponse = await apiPost(`${NODE_JS_SERVICE_API}/user/signin`, credentials);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { accessToken, username } = signInResponse.data;

      // Store user data and token in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username);
      setAccessToken(accessToken);
      setUsername(username);

      const getUserResponse = await apiGet(`${NODE_JS_SERVICE_API}/user`);
      localStorage.setItem('userAccount', JSON.stringify(getUserResponse.data));
      setUserAccount(getUserResponse.data);

      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  };

  const signOut = async (): Promise<boolean> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userAccount');
    setAccessToken(undefined);
    setUsername(undefined);
    setUserAccount(undefined);
    return true;
  };

  return (
    <AuthContext.Provider value={{
      userAccount,
      username,
      isAuthenticated: accessToken !== undefined,
      error,
      signIn,
      signOut,
      signUp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Use Context
export const useAuth = () => useContext(AuthContext);
