import AppLayout from "@/components/layouts/AppLayout";
import { PiFileCsvLight } from "react-icons/pi";
import { PiFilePdfLight } from "react-icons/pi";
import { PiPlusLight } from "react-icons/pi";

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
    Heading
} from '@chakra-ui/react'

export default function Eventos() {
    return <AppLayout>
        <Flex mb={"4"} alignItems={"center"} justifyContent={"space-between"} >
            <Heading size={"md"}>Eventos</Heading>
            <Flex gap="2">
                <Button size={"sm"} leftIcon={<PiFileCsvLight/>} colorScheme="purple" variant={"outline"}>CSV</Button>
                <Button size={"sm"} leftIcon={<PiFilePdfLight/>} colorScheme="purple" variant={"outline"}>PDV</Button>
                <Button size={"sm"} leftIcon={<PiPlusLight/>} colorScheme="green" variant={"outline"}>Novo</Button>
            </Flex>
        </Flex>
        <TableContainer>
            <Table size="lg" variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Evento</Th>
                        <Th>Descrição</Th>
                        <Th>Endereço</Th>
                        <Th>Início</Th>
                        <Th>Fim</Th>
                        <Th>Status</Th>
                        <Th textAlign={"right"}>Ações</Th>
                    </Tr>
                </Thead>
                <Tbody>
                </Tbody>
            </Table>
        </TableContainer>
    </AppLayout>

}