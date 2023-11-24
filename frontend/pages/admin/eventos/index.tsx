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
import React from "react";

export default function Eventos() {
    return (
        <AppLayout>
            <Flex mb={"4"} alignItems={"center"} justifyContent={"space-between"}>
                <Heading size={"md"}>Eventos</Heading>
                <Flex gap="2">
                    <Button
                        size={"sm"}
                        leftIcon={<PiFileCsvLight />}
                        colorScheme="purple"
                        variant={"outline"}
                    >
                        CSV
                    </Button>
                    <Button
                        size={"sm"}
                        leftIcon={<PiFilePdfLight />}
                        colorScheme="purple"
                        variant={"outline"}
                    >
                        PDV
                    </Button>
                    <Button
                        size={"sm"}
                        leftIcon={<PiPlusLight />}
                        colorScheme="green"
                        variant={"outline"}
                    >
                        Novo
                    </Button>
                </Flex>
            </Flex>
            <TableContainer>
                <Table size="lg" variant="simple">
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
                    <Tbody></Tbody>
                </Table>
            </TableContainer>
        </AppLayout>
    );

    
//     function CadastroEventos() {
//         const { isOpen, onOpen, onClose } = useDisclosure();

//         const initialRef = React.useRef(null);
//         const finalRef = React.useRef(null);

//         return (
//             <>
//                 <Button onClick={onOpen}>Open Modal</Button>
//                 <Button ml={4} ref={finalRef}>
//                     I'll receive focus on close
//                 </Button>

//                 <Modal
//                     initialFocusRef={initialRef}
//                     finalFocusRef={finalRef}
//                     isOpen={isOpen}
//                     onClose={onClose}
//                 >
//                     <ModalOverlay />
//                     <ModalContent>
//                         <ModalHeader>Cadastrar Evento</ModalHeader>
//                         <ModalCloseButton />
//                         <ModalBody pb={6}>
//                             <FormControl>
//                                 <FormLabel>First name</FormLabel>
//                                 <Input ref={initialRef} placeholder="First name" />
//                             </FormControl>

//                             <FormControl mt={4}>
//                                 <FormLabel>Last name</FormLabel>
//                                 <Input placeholder="Last name" />
//                             </FormControl>
//                         </ModalBody>

//                         <ModalFooter>
//                             <Button colorScheme="blue" mr={3}>
//                                 Save
//                             </Button>
//                             <Button onClick={onClose}>Cancel</Button>
//                         </ModalFooter>
//                     </ModalContent>
//                 </Modal>
//             </>
//         );
//     }
}
