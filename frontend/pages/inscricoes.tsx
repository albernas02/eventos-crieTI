"use client";

import { formatMoney } from "@/Utils/helpers";
import { checkUserAuth } from "@/Utils/pageAuthCheck";
import AppLayout from "@/components/layouts/AppLayout";
import { AuthContext } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";
import { Badge, Box, Button, Flex, Heading, Image, Spinner } from "@chakra-ui/react";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbX } from "react-icons/tb";
import { IEventoCard } from "./eventos";
import Link from "next/link";


export const getServerSideProps: GetServerSideProps = checkUserAuth(
    async (ctx) => {
        return {
            props: {},
        };
    }
);

export default function Inscricoes() {
    const [dados, setDados] = useState<any[]>([]);
    const { getUser } = useContext(AuthContext);

    async function carregarDados() {
        let response = await apiClient.get(`/tickets/${getUser()?.id}`);
        setDados(response.data);
    }

    useEffect(() => {
        carregarDados();
    }, [])

    function removerEvento(id: any) {
        setDados(tickets => {
            return tickets.filter(ticket => ticket.event.id != id);
        })
    }

    function marcarCheckin(id: any) {
        setDados(tickets => {
            return tickets.map(ticket => {
                if (ticket.event.id == id) {
                    ticket.presence = true;
                }

                return ticket;
        })})
    }

    return (
        <AppLayout>
            <Heading size={"md"}>Inscrições</Heading>
            <Flex wrap={"wrap"}>
                {
                    dados?.map(({ event: evento, presence }) =>
                        <EventoCard
                            key={evento.id}
                            id={evento.id}
                            nome={evento.name}
                            momento={moment(evento.startDate)}
                            valor={evento.price.replace(",", ".")}
                            endereco={evento.address}
                            tipo={evento.type}
                            descricao={evento.description}
                            removerEvento={removerEvento}
                            marcarCheckin={marcarCheckin}
                            checkinFeito={presence}
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
    removerEvento,
    marcarCheckin,
    checkinFeito = false
}: any) {
    const [isLoading, setLoading] = useState(false);
    const { getUser } = useContext(AuthContext);


    async function cancelar() {
        setLoading(true);

        try {
            await apiClient.post(`/desist/${getUser()?.id}`, { eventId: id });
            removerEvento(id);
            toast.success("Inscrição cancelada com sucesso!");
        } catch (e) {
            toast.error((e as any)?.response?.data?.mensagem || "Algo deu errado!");
        }

        setLoading(false);
    }



    async function checkin() {
        setLoading(true);

        try {
            await apiClient.post(`/checkIn/${getUser()?.id}`, { eventId: id });
            marcarCheckin(id);
            toast.success("Checkin realizado com sucesso!");
        } catch (e) {
            toast.error((e as any)?.response?.data?.mensagem || "Algo deu errado!");
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

                    <Box>{moment(momento).format("llll")}</Box>


                    <Box fontSize={"xs"}>{descricao}</Box>

                    <Box display="flex" mt="2" alignItems="center">
                        <Box color="gray.600" fontSize="sm">
                            {endereco}
                        </Box>
                    </Box>

                    <Flex mt={4} gap={2}>
                        {
                            !checkinFeito &&
                            <Button colorScheme={"red"} variant={"outline"} size={"sm"} onClick={cancelar} leftIcon={<TbX />}>
                                Cancelar Inscrição
                            </Button>
                        }

                        {
                            !checkinFeito &&
                            <Button colorScheme="green" size="sm" onClick={checkin}>Check-in</Button>
                        }

                        {
                            checkinFeito &&
                            <Link href={process.env.NEXT_PUBLIC_API_URL + `/pdfPresence/${getUser().id}/${id}`} download target="_blank">
                            <Button colorScheme="blue" size="sm" variant={"outline"}>Comprovante</Button>
                            </Link>
                        }
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}
