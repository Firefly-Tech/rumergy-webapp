import React, { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { roles } from "./constants";
import { useHistory } from "react-router-dom";

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

ProvideAuth.propTypes = {
  children: PropTypes.object,
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const history = useHistory();
  const apiHost = process.env.REACT_APP_API_HOST;

  // Axios instance for users
  const userAxiosInstance = axios.create();

  // Request interceptor
  userAxiosInstance.interceptors.request.use(
    async (config) => {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // Response interceptor
  userAxiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const access = await tryRefresh(localStorage.getItem("refresh"));
          setAccessToken(access);
          userAxiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access}`;
          originalRequest.headers["Authorization"] = `Bearer ${access}`;
          return axios(originalRequest);
        } catch (error) {
          signout();
          history.push("/login");
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  // App user
  // For non-logged in requests
  const [appRefreshToken, setAppRefreshToken] = useState(null);

  const signin = async (username, password) => {
    return axios
      .post(`${apiHost}/api/token/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        setAccessToken(res.data.access);
        let userObject = {
          username: res.data.user.username,
          id: res.data.user.id,
        };
        setUser(userObject);
        setRole(res.data.user.role);
        localStorage.setItem("refresh", res.data.refresh);

        return res.data.user;
      })
      .catch((error) => {
        throw error;
      });
  };

  const signup = async (username, password, email, firstName, lastName) => {
    return axios
      .post(
        `${apiHost}/api/users/`,
        {
          username: username,
          password: password,
          email: email,
          profile: {
            first_name: firstName,
            last_name: lastName,
            role: roles.Inactive,
          },
        },
        { headers: { Authorization: await withAppUser() } }
      )
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const signout = () => {
    setUser(false);
    setAccessToken(null);
    setRole(roles.General);
    localStorage.removeItem("refresh");

    return true;
  };

  const getAuthBearer = () => {
    // TODO: Add get new access token
    return `Bearer ${accessToken}`;
  };

  const tryRefresh = async (refreshToken) => {
    return axios
      .post(`${apiHost}/api/token/refresh/`, {
        refresh: refreshToken,
      })
      .then((res) => {
        return res.data.access;
      })
      .catch((error) => {
        throw error;
      });
  };

  const sendPasswordResetEmail = async (email) => {
    return axios
      .post(`${apiHost}/api/password_reset/`, {
        email: email,
      })
      .catch((error) => {
        throw error;
      });
  };

  const confirmPasswordReset = async (token, password) => {
    return axios
      .post(`${apiHost}/api/password_reset/confirm/`, {
        token: token,
        password: password,
      })
      .catch((error) => {
        throw error;
      });
  };

  const withAppUser = async () => {
    const appUserLogin = async () => {
      const loginResponse = await axios
        .post(`${apiHost}/api/token/`, {
          username: process.env.REACT_APP_RUMERGY_USER,
          password: process.env.REACT_APP_RUMERGY_PASS,
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
      setAppRefreshToken(loginResponse.refresh);

      return `Bearer ${loginResponse.access}`;
    };

    if (!appRefreshToken) {
      return appUserLogin();
    }

    try {
      const access = await tryRefresh(appRefreshToken);

      return `Bearer ${access}`;
    } catch (error) {
      if (error.response.status !== 401) {
        throw error;
      }
      return appUserLogin();
    }
  };

  const authStateChange = async (callBack) => {
    if (!localStorage.getItem("refresh")) return callBack(null, null, null);

    try {
      let access = await tryRefresh(localStorage.getItem("refresh"));
      let userObject = await axios
        .get(`${apiHost}/api/users/get_user_from_auth`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
      let role = userObject.profile.role;
      userObject = {
        username: userObject.username,
        id: userObject.id,
      };

      callBack(userObject, access, role);
    } catch (error) {
      callBack(null, null, null);
    }
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    const unsubscribe = authStateChange((userObject, access, userRole) => {
      if (userObject && access && userRole) {
        setUser(userObject);
        setAccessToken(access);
        setRole(userRole);
      } else {
        setUser(false);
        setAccessToken(null);
        setRole(roles.General);
      }
    });

    return () => unsubscribe();
  }, []);

  // Return the user objects and auth methods

  return {
    user,
    accessToken,
    role,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    withAppUser,
    apiHost,
    userAxiosInstance,
  };
}
