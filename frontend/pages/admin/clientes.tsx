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

interface IClientes {
    id?: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    CPF: string;
    address: string;
    situation: string;
}

export const getServerSideProps: GetServerSideProps = checkUserAuth(async (ctx) => {
    return {
        props: {}
    }
}, "users");

export default function Eventos() {
    const [dados, setDados] = useState<IClientes[]>([]);

    async function carregarDados() {
        let response = await apiClient.get('/clients');

        setDados(response.data);
    }

    useEffect(() => {
        carregarDados();
    }, []);


    return (
        <AppLayout>
            <Flex mb={"4"} alignItems={"center"} justifyContent={"space-between"}>
                <Heading size={"md"}>Clientes</Heading>
            </Flex>
            <TableContainer>
                <Table size="lg" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Nome</Th>
                            <Th>Eventos</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            dados?.map(cliente => <Tr>
                                <Td>{cliente.name}</Td>
                                {/* ... */}

                                <Td>
                                    <VisualizarEventos cliente={cliente} />
                                </Td>
                            </Tr>)
                        }

                    </Tbody>
                </Table>
            </TableContainer>
        </AppLayout>
    );


    function VisualizarEventos({ cliente, textoBotao = "Visualizar", icone = <IoEyeSharp /> }: { cliente?: IClientes, textoBotao?: string, icone?: any }) {
        const { isOpen, onOpen, onClose } = useDisclosure();

        const [dados, setDados] = useState<any[]>([]);

        async function carregarDados() {
            let response = await apiClient.get(`/tickets/${cliente?.id}`);

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
                        <ModalHeader>Eventos</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>


                        </ModalBody>
                        <Table size="lg" variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Evento</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    dados?.map(ticket => <Tr key={ticket.id}>
                                        <Td>{ticket.event.name}</Td>
                                        <Td>{ticket.event.description}</Td>
                                        <Td>{ticket.event.address}</Td>
                                        <Td>{moment(ticket.event.startDate).format("llll")}</Td>
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
