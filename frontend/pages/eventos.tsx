"use client";

import { formatMoney } from "@/Utils/helpers";
import { checkUserAuth } from "@/Utils/pageAuthCheck";
import AppLayout from "@/components/layouts/AppLayout";
import { AuthContext } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";
import { Badge, Box, Button, Flex, Heading, Image, Spinner } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbCheck, TbX } from "react-icons/tb";
import moment from 'moment';

export interface IEventoCard {
    id?: number;
    name: string;
    description: string;
    price: string;
    address: string;
    startDate: Date;
    endDate: Date;
    situation?: string;
    type: string;
    imgUrl?: string
}


export const getServerSideProps: GetServerSideProps = checkUserAuth(
    async (ctx) => {
        return {
            props: {},
        };
    }
);

export default function Eventos() {
    const [dados, setDados] = useState<IEventoCard[]>([]);
    const [inscricoes, setInscricoes] = useState<any[]>([]);
    const { getUser } = useContext(AuthContext);

    async function carregarDados() {
        let response = await apiClient.get(`/tickets/${getUser()?.id}`);
        setInscricoes(response.data);

        response = await apiClient.get('/events');
        setDados(response.data);
    }

    useEffect(() => {
        carregarDados();
    }, [])


    return (
        <AppLayout>
            <Heading size={"md"}>Eventos</Heading>
            <Flex wrap={"wrap"}>
                {
                    dados?.sort((a, b) => {
                        if (inscricoes?.find(inscricao => inscricao.event.id == a.id)) {
                            return 1;
                        }

                        if (inscricoes?.find(inscricao => inscricao.event.id == b.id)) {
                            return -1;
                        }

                        return 0;
                    })?.map(evento =>
                        <EventoCard
                            key={evento.id}
                            id={evento.id}
                            inscrito={inscricoes?.filter(inscricao => inscricao.event.id == evento.id)?.length > 0}
                            checkinFeito={inscricoes?.find(inscricao => inscricao.event.id == evento.id)?.presence}
                            nome={evento.name}
                            momento={evento.startDate}
                            valor={evento.price.replace(",", ".")}
                            endereco={evento.address}
                            tipo={evento.type}
                            descricao={evento.description}
                            imagemUrl={evento.imgUrl ? evento.imgUrl : "https://via.placeholder.com/500x300?text=Evento"}
                        />
                    )}
            </Flex>
        </AppLayout>
    );
}

function EventoCard({
    id,
    nome,
    imagemUrl,
    momento,
    valor,
    endereco,
    tipo,
    descricao,
    inscrito = false,
    checkinFeito
}: any) {
    const [isLoading, setLoading] = useState(false);
    const [_inscrito, _setInscrito] = useState(inscrito);
    const { getUser } = useContext(AuthContext);
    const { auth_type } = parseCookies();


    async function acao() {
        setLoading(true);
        if (_inscrito) {

            try {
                await apiClient.post(`/desist/${getUser()?.id}`, { eventId: id });

                _setInscrito(false);
                toast.success("Inscrição cancelada com sucesso!");
            } catch (e) {
                toast.error((e as any)?.response?.data?.mensagem || "Algo deu errado!");
            }
        } else {

            try {
                await apiClient.post(`/buy/${getUser()?.id}`, { eventId: id });

                _setInscrito(true);
                toast.success("Inscrito com sucesso");
            } catch (e) {
                toast.error((e as any)?.response?.data?.mensagem || "Algo deu errado!");
            }
        }
        setLoading(false);
    }


    return (
        <Box maxW={{ base: "full", md: "50%", lg: "33.33%" }} p={4} h="full" alignSelf={"stretch"} position={"relative"}>
            <Flex display={isLoading ? "flex" : "none"} align="center" justify="center" position={"absolute"} top={0} bottom={0} left={0} right={0} bg={"whiteAlpha.400"} backdropFilter={"blur(2px)"} zIndex={10}>
                <Spinner h="10" w="10" color="purple.500" />
            </Flex>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Image src={imagemUrl} width="500px" height="300px" alt="Evento" objectFit={"cover"} />

                <Box p="6">
                    <Box display="flex" alignItems="baseline">
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                            {valor > 0 ? formatMoney(valor) : "Gratuito"}
                        </Badge>
                        <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            ml="2"
                        >
                            {tipo}
                        </Box>
                    </Box>

                    <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        noOfLines={1}
                    >
                        {nome}
                    </Box>

                    <Box>{moment(momento).format("lll")}</Box>


                    <Box fontSize={"xs"}>{descricao}</Box>

                    <Box display="flex" mt="2" alignItems="center">
                        <Box color="gray.600" fontSize="sm">
                            {endereco}
                        </Box>
                    </Box>

                    <Flex mt={4} gap={2}>
                        {!checkinFeito && auth_type != "users" &&
                            <Button colorScheme={_inscrito ? "red" : "purple"} variant={_inscrito ? "outline" : "solid"} size={"sm"} onClick={acao} leftIcon={!_inscrito ? <TbCheck /> : <TbX />}>
                                {!_inscrito ? "Inscreva-se" : "Cancelar Inscrição"}
                            </Button>
                        }

                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}
