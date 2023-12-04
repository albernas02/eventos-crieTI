import AppLayout from "@/components/layouts/AppLayout";
import { PiFileCsvLight, PiPencil } from "react-icons/pi";
import { PiFilePdfLight } from "react-icons/pi";
import { PiPlusLight } from "react-icons/pi";
import {
    Image, Select,
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

interface IEvento {
    id?: number;
    name: string;
    description: string;
    price: string;
    address: string;
    startDate: Date;
    endDate: Date;
    situation: string;
    user: number;
    type: string;
    imgUrl: string;
}

export const getServerSideProps: GetServerSideProps = checkUserAuth(async (ctx) => {
    return {
        props: {}
    }
}, "users");

export default function Eventos() {
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
                <Heading size={"md"}>Gerenciar Eventos</Heading>
                <Flex gap="2">

                    <Link href={process.env.NEXT_PUBLIC_API_URL + "/csv"} download target="_blank">
                        <Button
                            size={"sm"}
                            leftIcon={<PiFileCsvLight />}
                            colorScheme="purple"
                            variant={"outline"}
                        >
                            CSV
                        </Button>
                    </Link>

                    <Link href={process.env.NEXT_PUBLIC_API_URL + "/pdf"} download target="_blank">
                        <Button
                            size={"sm"}
                            leftIcon={<PiFilePdfLight />}
                            colorScheme="purple"
                            variant={"outline"}
                        >
                            PDV
                        </Button>
                    </Link>
                    <CadastroEventos callback={carregarDados} />
                </Flex>
            </Flex>
            <TableContainer>
                <Table size="lg" variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Imagem</Th>
                            <Th>Evento</Th>
                            <Th>Descrição</Th>
                            <Th>Valor</Th>
                            <Th>Endereço</Th>
                            <Th>Início</Th>
                            <Th>Fim</Th>
                            <Th>Categoria</Th>
                            <Th>Status</Th>
                            <Th textAlign={"right"}>Ações</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            dados?.map(evento => <Tr>
                                <Td>{evento.imgUrl ? <Image src={evento.imgUrl} /> : "-"}</Td>
                                <Td>{evento.name}</Td>
                                <Td>{evento.description}</Td>
                                <Td>{evento.price}</Td>
                                <Td>{evento.address}</Td>
                                <Td>{moment(evento.startDate).format('llll')}</Td>
                                <Td>{moment(evento.endDate).format('llll')}</Td>
                                <Td>{evento.type}</Td>
                                <Td>{evento.situation}</Td>
                                {/* ... */}

                                <Td>
                                    <CadastroEventos callback={carregarDados} evento={evento} textoBotao="Editar" icone={<PiPencil />} />
                                </Td>
                            </Tr>)
                        }

                    </Tbody>
                </Table>
            </TableContainer>
        </AppLayout>
    );


    function CadastroEventos({ evento, textoBotao = "Novo", icone = <PiPlusLight />, callback }: { evento?: IEvento, textoBotao?: string, icone?: any, callback: any }) {
        const { isOpen, onOpen, onClose } = useDisclosure();
        const { getUser } = useContext(AuthContext);

        const { register, handleSubmit } = useForm({
            defaultValues: {
                name: evento?.name,
                description: evento?.description,
                price: evento?.price,
                address: evento?.address,
                startDate: moment(evento?.startDate).format('YYYY-MM-DD\THH:mm'),
                endDate: moment(evento?.endDate).format('YYYY-MM-DD\THH:mm'),
                type: evento?.type,
                situation: evento?.situation,
                imgUrl: evento?.imgUrl
            }
        });

        async function onSubmit(values: any) {
            try {
                let response = null;

                values.user = getUser().id;
                if (evento?.id) {
                    // Editar
                    response = await apiClient.put(`/events/${evento?.id}`, values);
                } else {
                    response = await apiClient.post(`/events`, values);
                }

                callback();
                onClose()

            } catch (err) {
                toast.error((err as any)?.response?.data?.mensagem || 'Algo deu errado! Por favor, tente novamente mais tarde.');
            }
        }

        let randomId = (Math.random() + 1).toString(36).substring(7);

        return (
            <>
                <Button onClick={onOpen}
                    size={"sm"}
                    leftIcon={icone}
                    colorScheme="green"
                    variant={"outline"}
                >
                    {textoBotao}
                </Button>
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Evento</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleSubmit(onSubmit)} id={randomId}>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Nome</FormLabel>
                                    <Input {...register('name')} />
                                </FormControl>

                                <FormControl id="description" isRequired mt={4}>
                                    <FormLabel>Descrição</FormLabel>
                                    <Input {...register('description')} />
                                </FormControl>

                                <FormControl id="price" isRequired mt={4}>
                                    <FormLabel>Preço</FormLabel>
                                    <Input {...register('price')} />
                                </FormControl>

                                <FormControl id="address" isRequired mt={4}>
                                    <FormLabel>Endereço</FormLabel>
                                    <Input {...register('address')} />
                                </FormControl>

                                <FormControl id="startDate" isRequired mt={4}>
                                    <FormLabel>Data de Início</FormLabel>
                                    <Input type="datetime-local" {...register('startDate')} />
                                </FormControl>

                                <FormControl id="endDate" isRequired mt={4}>
                                    <FormLabel>Data do Fim</FormLabel>
                                    <Input type="datetime-local" {...register('endDate')} />
                                </FormControl>

                                <FormControl id="type" isRequired mt={4}>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select placeholder='Selecione uma opção' {...register('type')}>
                                        <option value='Presencial'>Presencial</option>
                                        <option value='Online'>Online</option>
                                    </Select>
                                </FormControl>

                                <FormControl id="situation" isRequired mt={4}>
                                    <FormLabel>Status</FormLabel>
                                    <Select placeholder='Selecione uma opção' {...register('situation')}>
                                        <option value='Ativo'>Ativo</option>
                                        <option value='Inativo'>Inativo</option>
                                    </Select>
                                </FormControl>

                                <FormControl id="imgUrl" mt={4}>
                                    <FormLabel>URL da Imagem</FormLabel>
                                    <Input type="url" {...register('imgUrl')} />
                                </FormControl>
                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="purple" mr={3} type="submit" form={randomId}>
                                Salvar
                            </Button>
                            <Button onClick={onClose}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    }
}
