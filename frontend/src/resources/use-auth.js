import React, { useState, useEffect, useContext, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { roles } from "./constants";
import { string } from "yup/lib/locale";

const authContext = createContext();
const apiHost = process.env.REACT_APP_API_HOST;

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
  const [role, setRole] = useState(roles.General);
  const [accessToken, setAccessToken] = useState(null);

  // App user
  // For non-logged in requests
  const [appAccessToken, setAppAccessToken] = useState(null);
  const [appRefreshToken, setAppRefreshToken] = useState(null);

  // TODO: Change to throw error like withAppUser
  const signin = (username, password) => {
    return axios
      .post(`${apiHost}/api/token/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        setAccessToken(res.data.access);
        let user = {
          username: res.data.user.username,
          id: res.data.user.id,
        };
        setUser(user);
        setRole(res.data.user.role);
        localStorage.setItem("refresh", res.data.refresh);

        return "OK";
      })
      .catch((error) => {
        if (error.response) {
          return "Unauthorized";
        } else if (error.request) {
          return "No response";
        } else {
          return "Unknown error";
        }
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
        if (error.response) {
          throw new Error("Unauthorized");
        } else if (error.request) {
          throw new Error("No response");
        } else {
          throw new Error("Unknown error");
        }
      });
  };
  const signout = () => {
    setUser(null);
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
        if (error.response) {
          throw new Error("Unauthorized");
        } else if (error.request) {
          throw new Error("No response");
        } else {
          throw new Error("Unknown error");
        }
      });
  };
  const sendPasswordResetEmail = (email) => {};
  const confirmPasswordReset = (code, password) => {};

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
          if (error.response) {
            throw new Error("Unauthorized");
          } else if (error.request) {
            throw new Error("No response");
          } else {
            throw new Error("Unknown error");
          }
        });
      setAppRefreshToken(loginResponse.refresh);
      setAppAccessToken(loginResponse.access);

      return `Bearer ${loginResponse.access}`;
    };

    if (!appRefreshToken) {
      return appUserLogin();
    }

    try {
      const access = await tryRefresh(appRefreshToken);
      setAppAccessToken(access);

      return `Bearer ${access}`;
    } catch (error) {
      if (error.message !== "Unauthorized") {
        throw error;
      }
      return appUserLogin();
    }
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  // TODO: Add error catching and other cases
  useEffect(() => {
    //axios
    //.post(`${apiHost}/api/refresh/`, {
    //refresh: localStorage.getItem("refresh"),
    //})
    //.then((res) => {
    //setAccessToken(res.data.access);
    //});
    //axios
    //.get(`${apiHost}/api/users/get_user_from_auth`, {
    //headers: { Authorization: getAuthBearer() },
    //})
    //.then((res) => {
    //let temp = res.data.user;
    //const { profile, ...user } = temp;
    //setUser(user);
    //setRole(profile.role);
    //});
  }, []);
  // Return the user object and auth methods
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
  };
}
