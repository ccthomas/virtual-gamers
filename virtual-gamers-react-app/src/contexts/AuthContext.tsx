import { AxiosError } from 'axios';
import React, {
  createContext, useContext, useState,
} from 'react';
import { apiGet, apiPost } from '../utils/apiUtil';
import { UserAccount } from '../types/UserAccount';
import { NODE_JS_SERVICE_API } from '../constants';

interface AuthContextType {
  userAccount: UserAccount | undefined;
  username: string | undefined;
  isAuthenticated: boolean;
  error: string | undefined;
  signIn: (credentials: { username: string; password: string; }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (user: { username: string; password: string; iconName: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userAccount: undefined,
  username: undefined,
  isAuthenticated: false,
  error: undefined,
  signIn: async () => { },
  signOut: async () => { },
  signUp: async () => { },
});

// Provide Context
export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [username, setUsername] = useState<string | undefined>(localStorage.getItem('username') || undefined);
  const userAccountAsStr = localStorage.getItem('userAccount');
  let userAccountParsed: UserAccount | undefined;
  if (userAccountAsStr !== null) {
    userAccountParsed = JSON.parse(userAccountAsStr) as UserAccount;
  }
  const [userAccount, setUserAccount] = useState<UserAccount | undefined>(userAccountParsed);
  const [accessToken, setAccessToken] = useState<string | undefined>(localStorage.getItem('accessToken') || undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const signUp = async (user: { username: string; password: string; iconName: string }) => {
    const response = await apiPost(`${NODE_JS_SERVICE_API}/user/signup`, user)
      .catch((e) => e);
    if (response instanceof AxiosError) {
      setError(response.message);
    }
  };

  const signIn = async (credentials: { username: string; password: string; }) => {
    const response = await apiPost(`${NODE_JS_SERVICE_API}/user/signin`, credentials)
      .catch((e) => e);
    if (response instanceof AxiosError) {
      setError(response.message);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { accessToken, username } = response.data;
    // Store user data and token in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('username', username);
    setAccessToken(accessToken);
    setUsername(username);

    await apiGet(`${NODE_JS_SERVICE_API}/user`).then((r) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      localStorage.setItem('userAccount', JSON.stringify(r.data));
      setUserAccount(r.data);
    }).catch((e) => setError(e));
  };

  const signOut = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userAccount');
    setAccessToken(undefined);
    setUsername(undefined);
    setUserAccount(undefined);
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
