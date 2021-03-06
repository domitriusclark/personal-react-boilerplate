import React, { useState, ReactNode } from 'react';

import { ENABLED_PROVIDER } from '../../../constants';
import { INTERNAL_SERVER_ERROR } from '../../../utils/statusCodes';
import { MFC } from '../../types';
import {
  AuthContext,
  User,
  LoginOptions,
  LocalLoginOptions,
} from './AuthContext';

export interface AuthContextProviderProps {
  session: User | null;
  children: ReactNode;
}

export const endpoints = {
  login: {
    method: 'POST',
    url: '/api/v1/auth/login',
  },
  logout: {
    method: 'DELETE',
    url: '/api/v1/auth/logout',
  },
  provider: {
    url: '/api/v1/auth/provider',
  },
  register: {
    method: 'POST',
    url: '/api/v1/auth/register',
  },
};

export const AuthContextProvider: MFC<AuthContextProviderProps> = ({
  children,
  session,
}) => {
  const [user, setUser] = useState<User | null>(session);

  /**
   * Given { provider: ENABLED_PROVIDER[number] }, will redirect.
   *
   * Given login data, will attempt to login.
   *
   * @returns
   * - nothing when redirecting
   * - the user when successfully authenticated
   * - the response status code when failing to authenticate
   * - INTERNAL_SERVER_ERROR when crashing
   */
  async function login(options: LoginOptions) {
    if ('provider' in options) {
      if (ENABLED_PROVIDER.includes(options.provider)) {
        window.location.assign(
          endpoints.provider.url.replace('provider', options.provider)
        );
      }

      return;
    }

    try {
      const { url, method } = endpoints.login;

      const response = await fetch(url, {
        body: JSON.stringify(options),
        method,
      });

      if (response.ok) {
        const json = await response.json();

        setUser(json);
        return json;
      }

      return response.status;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * Dispatches a request to the logout endpoint which deletes the session cookie.
   * Resets User object afterwards.
   */
  async function logout() {
    const { url, method } = endpoints.logout;

    await fetch(url, { method });
    setUser(null);
  }

  /**
   * Will attempt to register the user.
   *
   * @returns
   * - the user when successfully registered
   * - the response status code when failing to register
   * - INTERNAL_SERVER_ERROR when crashing
   */
  async function register(options: LocalLoginOptions) {
    try {
      const { url, method } = endpoints.register;

      const response = await fetch(url, {
        body: JSON.stringify(options),
        method,
      });

      if (response.ok) {
        const json = await response.json();

        setUser(json);
        return json;
      }

      return response.status;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return INTERNAL_SERVER_ERROR;
    }
  }

  const value = {
    isAuthenticated: !!user,
    login,
    logout,
    register,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
