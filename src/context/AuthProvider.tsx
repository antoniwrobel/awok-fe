import axiosInstance from "src/auth/axios-config";
import { createContext } from "react";
import {
  removeTokens,
  setAccessToken,
  setRefreshToken,
} from "src/auth/auth-service";
import {
  AuthContextType,
  GetAccessAndRefreshResponse,
} from "../types/auth.types";
import { useUser } from "src/hooks";

export const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getSessionAndSetUser } = useUser();
  const getAccessAndRefresh = async (username: string, password: string) => {
    try {
      const successResponse =
        await axiosInstance.post<GetAccessAndRefreshResponse>("get-token", {
          username,
          password,
        });
      if (successResponse.status === 200) {
        setAccessToken(successResponse.data.access);
        setRefreshToken(successResponse.data.refresh);
        try {
          await getSessionAndSetUser();
        } catch (error) {
          console.error(error); // TODO: what should we do
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const signOut = async (callback: VoidFunction) => {
    callback();
    removeTokens();
  };

  const value = { signOut, getAccessAndRefresh };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
