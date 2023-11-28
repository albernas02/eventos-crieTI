import AppLayout from "@/components/layouts/AppLayout";
import { PiPencil, PiPercent, PiPlusLight } from "react-icons/pi";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
} from '@chakra-ui/react'

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
    useDisclosure
} from '@chakra-ui/react'
import React, { useEffect, useState } from "react";
import { apiClient } from "@/services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IUsuario {
    id?: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    CPF: string;
    address: string;
    situation: string;
}

export default function Usuarios() {
    const [ dados, setDados ] = useState<IUsuario[]>([]);

    async function carregarDados() {
        let response = await apiClient.get('/users');

        setDados(response.data);
    }

    useEffect(() => {
        carregarDados();
    }, []);

    return (
    <AppLayout>
        <Flex mb={"4"} alignItems={"center"} justifyContent={"space-between"} >
            <Heading size={"md"}>Usuários</Heading>
            <Flex>
                <CadastroUsuarios />
            </Flex>
        </Flex>
        <TableContainer>
            <Table size="lg" variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Nome</Th>
                        <Th>Email</Th>
                        <Th>Status</Th>
                        <Th textAlign={"center"}>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                {
                    dados?.map(usuario => <Tr>
                        <Td>{usuario.name}</Td>
                        <Td>{usuario.email}</Td>
                        {/* <Td>{usuario.password}</Td>
                        <Td>{usuario.address}</Td>
                        <Td>{usuario.CPF}</Td>
                        <Td>{usuario.phone}</Td> */}
                        <Td>{usuario.situation}</Td>
                        {/* ... */}

                        <Td textAlign={"center"}>
                            <CadastroUsuarios usuario={usuario} textoBotao="Editar" icone={<PiPencil/>} />
                        </Td>
                    </Tr>)
                }
                </Tbody>
            </Table>
        </TableContainer>
    </AppLayout>
);

    function CadastroUsuarios({ usuario, textoBotao = "Novo", icone = <PiPlusLight />}: {usuario?: IUsuario, textoBotao?: string, icone?: any}) {
        const { isOpen, onOpen, onClose } = useDisclosure();

        const { register, handleSubmit } = useForm({
            defaultValues: {
                name: usuario?.name,
                email: usuario?.email,
                password: usuario?.password,
                address: usuario?.address,
                CPF: usuario?.CPF,
                phone: usuario?.phone,
                situation: usuario?.situation

            }
        });

        async function onSubmit(values: any) {
            try {
                let response = null;
 
                if (usuario?.id) {
                    // Editar
                    response = await apiClient.put(`/users/${usuario?.id}`, values);
                } else {
                    response = await apiClient.post(`/users`, values);
                }

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
                        <ModalHeader>Usuário</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <form onSubmit={handleSubmit(onSubmit)} id={randomId}>
                                <FormControl id="name" isRequired>
                                    <FormLabel>Nome</FormLabel>
                                    <Input {...register('name')} />
                                </FormControl>

                                <FormControl id="email" isRequired mt={4}>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...register('email')} />
                                </FormControl>

                                <FormControl id="Password" isRequired mt={4}>
                                    <FormLabel>Senha</FormLabel>
                                    <Input {...register('password')} />
                                </FormControl>

                                <FormControl id="Password" isRequired mt={4}>
                                    <FormLabel>Confirme sua senha</FormLabel>
                                    <Input {...register('password')} />
                                </FormControl>

                                <FormControl id="phone" isRequired mt={4}>
                                    <FormLabel>Telefone</FormLabel>
                                    <Input {...register('phone')} />
                                </FormControl>

                                <FormControl id="CPF" isRequired mt={4}>
                                    <FormLabel>CPF</FormLabel>
                                    <Input {...register('CPF')} />
                                </FormControl>

                                <FormControl id="address" isRequired mt={4}>
                                    <FormLabel>Endereço</FormLabel>
                                    <Input {...register('address')} />
                                </FormControl>

                                <FormControl id="situation" isRequired mt={4}>
                                    <FormLabel>Status</FormLabel>
                                    <Select placeholder='Selecione uma opção' {...register('situation')}>
                                        <option value='Ativo'>Ativo</option>
                                        <option value='Inativo'>Inativo</option>
                                    </Select>
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