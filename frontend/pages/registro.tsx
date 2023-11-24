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

export default function Registro() {
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    async function registro(values) {
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
            <Stack spacing={8} mx={"auto"} maxW={"lg"} minW={"md"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Crie sua conta</Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <form onSubmit={handleSubmit(registro)}>
                        <Stack spacing={4}>
                        <FormControl id="name" isRequired>
                                <FormLabel>Nome</FormLabel>
                                <Input type="text" {...register('name')} />
                            </FormControl>
                            <FormControl id="phone" isRequired>
                                <FormLabel>Telefone</FormLabel>
                                <Input minLength={8} type="tel" {...register('phone')} />
                            </FormControl>
                            <FormControl id="cpf" isRequired>
                                <FormLabel>CPF</FormLabel>
                                <Input minLength={11} type="tel" {...register('cpf')} />
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" {...register('email')} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Senha</FormLabel>
                                <PasswordInput {...register('password')} />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Confirme sua senha</FormLabel>
                                <PasswordInput {...register('password_confirmation')} />
                            </FormControl>
                            <Stack spacing={4}>
                                <Button type='submit'
                                    colorScheme="purple"
                                    loadingText='Criando...'
                                    isLoading={loading}
                                >
                                    Criar conta
                                </Button>

                                <Flex gap={1} justify={"center"}>Já tem uma conta? <Link href="/login"><Text color="purple.400">Acesse</Text></Link></Flex>

                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}
