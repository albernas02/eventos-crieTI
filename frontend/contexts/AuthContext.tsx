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
  token?: string;
  getUser: () => IUser;
  login: (email: string, password: string, route: string) => Promise<void>;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: any) {
  const { token, user: _user } = parseCookies();

  function getUser() {
    const { user: _user } = parseCookies();

    return JSON.parse(_user || "{}") as IUser;
  }

  async function login(email: string, password: string, route = "/loginUsers") {
    try {
      const response = await apiClient.post(route, {
        email,
        password,
      });

      const token = response.data.token;
          console.log(response.data)

            setCookie(undefined, 'token', token, {
                maxAge: 60 * 60 * 24 * 7, // 7 dias
                path: "/"
            });

            setCookie(undefined, 'user', JSON.stringify(response.data.user), {
              maxAge: 60 * 60 * 24 * 7, // 7 dias
              path: "/"
          });

      // Making sure the token is up to date
      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

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

  return (
    <AuthContext.Provider
      value={{ getUser, token, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}
