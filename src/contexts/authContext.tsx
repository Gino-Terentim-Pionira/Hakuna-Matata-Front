import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useHistory } from 'react-router-dom';
import { SignIn } from '../services/auth';


interface IAuthProvider {
  children: React.ReactNode
};

interface IAuthContext {
  userId: string,
  authenticated: boolean | undefined,
  handleLogin: (email: string, password: string) => Promise<void>,
  handleLogout: () => Promise<void>
};

const AuthContext = createContext<IAuthContext>({} as IAuthContext);


export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('@pionira/token');
    const _userId = sessionStorage.getItem('@pionira/userId');

    if (token && _userId) {
      setAuthenticated(true);
      setUserId(_userId);
    } else {
      setAuthenticated(false);
    }

  }, []);

  async function handleLogin(email: string, password: string) {
      const result = await SignIn(email, password);
      sessionStorage.setItem('@pionira/token', result.token);
      sessionStorage.setItem('@pionira/userId', result.user.id);
      setAuthenticated(true);
      setUserId(result.user.id);
      history.push('/mainPage');
  };

  async function handleLogout() {
    setAuthenticated(false);
    setUserId('');
    sessionStorage.removeItem('@pionira/token');
    sessionStorage.removeItem('@pionira/userId');
    api.defaults.headers.Authorization = '';
    history.push('/login');
    setTimeout(function () {
      window.location.reload();
    });
  };

  return (
    <AuthContext.Provider value={{ userId, handleLogin, handleLogout, authenticated }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
