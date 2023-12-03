import AppLayout from "@/components/layouts/AppLayout";
import { PiFileCsvLight, PiPencil } from "react-icons/pi";
import { PiFilePdfLight } from "react-icons/pi";
import { PiPlusLight } from "react-icons/pi";
import { Select } from '@chakra-ui/react'

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Flex,
    Button,
    Heading,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
} from "@chakra-ui/react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";
import toast from "react-hot-toast";
import moment from "moment";
import { GetServerSideProps } from "next";
import { checkUserAuth } from "@/Utils/pageAuthCheck";
import Link from "next/link";
import { IoEye, IoEyeSharp } from "react-icons/io5";
import Eventos from "../eventos";

interface IEvento {
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

export const getServerSideProps: GetServerSideProps = checkUserAuth(async (ctx) => {
    return {
        props: {}
    }
}, "users");

export default function Encerrados() {
    const [dados, setDados] = useState<IEvento[]>([]);

    async function carregarDados() {
        let response = await apiClient.get('/events');

        setDados(response.data);
    }

    useEffect(() => {
        carregarDados();
    }, []);


    return (
        <AppLayout>
            <Flex mb={"4"} alignItems={"center"} justifyContent={"space-between"}>
                <Heading size={"md"}>Relatório de Eventos</Heading>
            </Flex>
            <TableContainer>
                <Table size="lg" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Eventos</Th>
                            <Th>Participantes</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            dados?.map(Eventos => <Tr>
                                <Td>{Eventos.name}</Td>
                                {/* ... */}

                                <Td>
                                    <VisualizarUsuarios evento={Eventos} />
                                </Td>
                            </Tr>)
                        }

                    </Tbody>
                </Table>
            </TableContainer>
        </AppLayout>
    );


    function VisualizarUsuarios({ evento, textoBotao = "Visualizar", icone = <IoEyeSharp /> }: { evento?: IEvento, textoBotao?: string, icone?: any }) {
        const { isOpen, onOpen, onClose } = useDisclosure();

        const [dados, setDados] = useState<any[]>([]);

        async function carregarDados() {
            let response = await apiClient.get(`/tickets/${evento?.id}`);

            setDados(response.data);
        }
        useEffect(() => {
            if (isOpen) {
                carregarDados();
            }
        }, [isOpen]);

        return (
            <>
                <Button onClick={onOpen}
                    size={"sm"}
                    leftIcon={icone}
                    colorScheme="gray"
                    variant={"solid"}
                >
                    {textoBotao}
                </Button>
                <Modal
                    size="2xl"
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Usuários</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>


                        </ModalBody>
                        <Table size="lg" variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Usuário</Th>
                                    <Th>CPF</Th>
                                    <Th>Comparecimento</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    dados?.map(ticket => <Tr key={ticket.id} >
                                        <Td>{ticket.client.name}</Td>
                                        <Td>{ticket.client.CPF}</Td>
                                        <Td>{ticket.presence ? "Sim":"Não" }</Td>
                                        {/* ... */}
                                    </Tr>)
                                }

                            </Tbody>
                        </Table>
                        <ModalFooter>
                            <Button onClick={onClose}>Sair</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    }
}
