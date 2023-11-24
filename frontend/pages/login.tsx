"use client";
import { useForm } from 'react-hook-form'
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from 'react';
import toast from 'react-hot-toast';
import PasswordInput from '@/components/UI/PasswordInput';

export default function Login() {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    async function login(values) {
        console.log(values)
        setLoading(true);

        setTimeout(() => {
            setLoading(false)
            toast.error("Usuário ou senha incorretos")
        }, 2000)
    }
    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Faça seu login</Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <form onSubmit={handleSubmit(login)}>
                        <Stack spacing={4}>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" {...register('email')} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Senha</FormLabel>
                                <PasswordInput {...register('password')} />
                            </FormControl>
                            <Stack spacing={4}>
                                <Button type='submit'
                                    colorScheme="purple"
                                    loadingText='Autenticando...'
                                    isLoading={loading}
                                >
                                    Acessar
                                </Button>

                                <Flex gap={1} justify={"center"}>Não tem uma conta? <Link href="/registro"><Text color="purple.400">Registre-se</Text></Link></Flex>

                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}
