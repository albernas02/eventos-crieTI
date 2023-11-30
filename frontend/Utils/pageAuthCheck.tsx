import { getAPIClient } from "@/services/api";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

export function checkUserAuth(fn: GetServerSideProps, permission_type = 'clients') {
    return async (context: GetServerSidePropsContext) => {
        // Check if the user is authenticated and token still valid
        const apiClient = getAPIClient(context);
        let valid = true;

        const { auth_type } = parseCookies(context);

        if (permission_type == "users") {
            if (auth_type != "users") {
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }

        try {
            await apiClient.get(`/auth/${auth_type || "clients"}/check`);
        } catch (err) {
            valid = false;
        }

        // Not valid, redirect to login
        if (!valid) {
            return {
                redirect: {
                    destination: `${auth_type == "users" ? "/admin" : ""}/login`,
                    permanent: false
                }
            }
        }

        return fn(context);
    }
}
