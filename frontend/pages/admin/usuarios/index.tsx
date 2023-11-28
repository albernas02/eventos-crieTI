import AppLayout from "@/components/layouts/AppLayout";
import { PiPlusLight } from "react-icons/pi";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
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
import React from "react";

export default function Usuarios() {

    return <AppLayout>
        <Flex mb={"4"} alignItems={"center"} justifyContent={"space-between"} >
            <Heading size={"md"}>Usuários</Heading>
            <Flex>
                <Button size={"sm"} leftIcon={<PiPlusLight/>} colorScheme="green" variant={"outline"}>Novo</Button>
            </Flex>
        </Flex>
        <TableContainer>
            <Table size="lg" variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Nome</Th>
                        <Th>Email</Th>
                        <Th textAlign={"right"}>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                </Tbody>
            </Table>
        </TableContainer>
    </AppLayout>

function CadastroUsuarios() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    return (
        <>
        <Button onClick={onOpen}
                    size={"sm"}
                    leftIcon={<PiPlusLight />}
                    colorScheme="green"
                    variant={"outline"}
                >
                    Novo
                </Button>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Cadastrar Novo Evento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl id="name">
                            <FormLabel>Nome</FormLabel>
                            <Input placeholder="" {...register('name')} />
                        </FormControl>

                        <FormControl id="description" mt={4}>
                            <FormLabel>Descrição</FormLabel>
                            <Input placeholder="" {...register('description')} />
                        </FormControl>

                        <FormControl id="address" mt={4}>
                            <FormLabel>Endereço</FormLabel>
                            <Input placeholder="" {...register('address')} />
                        </FormControl>

                        <FormControl id="startDate" mt={4}>
                            <FormLabel>Data de Início</FormLabel>
                            <Input placeholder="" {...register('startDate')} />
                        </FormControl>

                        <FormControl id="endDate" mt={4}>
                            <FormLabel>Data do Fim</FormLabel>
                            <Input placeholder="" {...register('endDate')} />
                        </FormControl>

                        <FormControl id="situation" mt={4}>
                            <FormLabel>Status</FormLabel>
                                <Select placeholder='Selecione uma opção' {...register('situation')}>
                                    <option value='Ativo'>Ativo</option>
                                    <option value='Inativo'>Inativo</option>
                                </Select>
                        </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="purple" mr={3}>
                            Salvar
                        </Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    }
}