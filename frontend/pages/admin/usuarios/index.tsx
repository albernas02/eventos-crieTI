import AppLayout from "@/components/layouts/AppLayout";
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

}