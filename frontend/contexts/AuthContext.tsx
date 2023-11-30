"use client";

import { apiClient } from "@/services/api";
import { AxiosError } from "axios";
import Router from "next/router";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address?: string;
  situation?: string;
}

export interface ILogin {
  email: string;
  password: string;
  route?: string;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  token?: string;
  user?: IUser | null;
  login: (email: string, password: string, route: string) => Promise<void>;
  updateUserData: () => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const { token } = parseCookies();

  const isAuthenticated = !!user;

  useEffect(() => {
    if (token) {
      updateUserData();
    }
  }, []);

  async function login(email: string, password: string, route = "/loginUsers") {
    try {
      const response = await apiClient.post(route, {
        email,
        password,
      });

      const token = response.data.token;

      setCookie(undefined, "token", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      // Making sure the token is up to date
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      // Fetch user data
      await updateUserData();

      toast.success("Bem vindo!", {
        duration: 1000,
      });

      Router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.data?.mensagem) {
          console.log("hello");
          toast.error(err.response.data.mensagem);
        }
        return;
      }

      toast.error("Algo deu errado! Por favor, tente novamente mais tarde.");
    }
  }

  async function updateUserData() {
    return;
    try {
      const response = await apiClient.get("/me");
      if (response.status == 200) {
        setUser(response.data.data);

        // Update cookie duration
        const { token } = parseCookies();

        if (token) {
          setCookie(undefined, "token", token, {
            maxAge: 60 * 60 * 24 * 7, // 7 dias
          });
        }
      } else {
        toast.error(
          "Algo deu errado ao obter os dados do usuário! Por favor, recarregue a tela e tente novamente."
        );
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 401) {
          toast.error("Sessão expirada!");

          destroyCookie(undefined, "token");
        }
        return;
      }

      toast.error(
        "Algo deu errado ao obter os dados do usuário! Por favor, recarregue a tela e tente novamente."
      );
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
