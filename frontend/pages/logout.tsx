import { GetServerSideProps } from "next";
import { destroyCookie } from "nookies";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    destroyCookie(ctx, 'token');
    destroyCookie(ctx, 'auth_type');

    return {
        redirect: {
            destination: `/login`,
            permanent: false
        }
    }
}

export default function Logout() {
    return ""
}