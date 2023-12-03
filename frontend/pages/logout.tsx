import { GetServerSideProps } from "next";
import { destroyCookie, parseCookies } from "nookies";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { auth_type } = parseCookies(ctx);

    let rota = auth_type == "users" ? "/admin/login" : "/login";

    destroyCookie(ctx, 'token');
    destroyCookie(ctx, 'user');
    destroyCookie(ctx, 'auth_type');

    return {
        redirect: {
            destination: rota,
            permanent: false
        }
    }
}

export default function Logout() {
    return ""
}