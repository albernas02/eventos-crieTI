"use client";

import { formatMoney } from "@/Utils/helpers";
import { checkUserAuth } from "@/Utils/pageAuthCheck";
import AppLayout from "@/components/layouts/AppLayout";
import { apiClient } from "@/services/api";
import { Badge, Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IEventoCard {
    id?: number;
    name: string;
    description: string;
    price: string;
    address: string;
    startDate: Date;
    endDate: Date;
    situation?: string;
    type: string;
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

    async function carregarDados() {
        let response = await apiClient.get('/buy/:id');

        setDados(response.data);
    }

    useEffect(() => {
        carregarDados();
    }, [])


    return (
        <AppLayout>
            <Heading size={"md"} >Eventos</Heading>
            <Flex wrap={"wrap"}>
                {
                    dados?.map(evento =>
                        <EventoCard
                            id={evento.id}
                            inscrito={true}
                            nome={evento.name}
                            momento={moment(evento.startDate).format('llll')}
                            valor={evento.price}
                            endereco={evento.address}
                            tipo={evento.type}
                            descricao={evento.description}
                        />
                    )}
            </Flex>
        </AppLayout>
    );
}

function EventoCard({
    id,
    nome,
    imagemUrl = "https://bit.ly/2Z4KKcF",
    momento,
    valor,
    endereco,
    tipo,
    descricao,
    inscrito = false
}: any) {
    const [isLoading, setLoading] = useState(false);
    const [_inscrito, _setInscrito] = useState(inscrito);

    async function acao() {
        setLoading(true);
        if (_inscrito) {
            // Chamar api de desinscrever

            _setInscrito(false);
        } else {
            // Chamar api de inscricao
            try {
                // await apiClient.post(`/eventos/${id}/inscrever`, {
                //     user_id: 1
                // });
                _setInscrito(true);
                toast.success("Inscrito com sucesso");
            } catch {
                toast.error("Mensagem");
            }
        }
        setLoading(false);
    }


    return (
        <Box maxW={{ base: "full", md: "50%", lg: "33.33%" }} p={4} h="full" alignSelf={"stretch"}>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Image src={imagemUrl} alt="Evento" />

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
                        <Button colorScheme="purple" variant={_inscrito ? "outline" : "solid"} size={"sm"} onClick={acao}>
                            {!_inscrito ? "Inscreva-se" : "Inscrito"}
                        </Button>

                        {
                            _inscrito && <Button colorScheme="green" size="sm">Check-in</Button>
                        }
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}
