import { checkUserAuth } from "@/Utils/pageAuthCheck";
import AppLayout from "@/components/layouts/AppLayout";


import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = checkUserAuth(async (ctx) => {
    return {
        props: {}
    }
});

export default function Index() {
    return <AppLayout> 
        index
    </AppLayout>
}