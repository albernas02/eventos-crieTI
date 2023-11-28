import { getAPIClient } from "@/services/api";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

export function checkUserAuth(fn: GetServerSideProps) {
    return async (context: GetServerSidePropsContext) => {
        // Check if the user is authenticated and token still valid
        const apiClient = getAPIClient(context);
        let valid = true;

        const { token } = parseCookies(context);


        // try {
        //     await apiClient.get('/auth/check');
        // } catch (err) {
        //     valid = false;
        // }

        // Not valid, redirect to login
        if (!valid || !token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false
                }
            }
        }

        return fn(context);
    }
}
