import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(serverSideContext?: any) {
    const { token } = parseCookies(serverSideContext);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL
    });

    if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    return api;
}

export const apiClient = getAPIClient();