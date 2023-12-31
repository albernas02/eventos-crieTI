"use client";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import toast from "react-hot-toast";
import PasswordInput from "@/components/UI/PasswordInput";
import { apiClient } from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Registro() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  async function registro(values: any) {
    if (values.password != values.password_confirmation) {
      toast.error("Senhas não conferem");
      return;
    }

    setLoading(true);
    try {
        delete values.password_confirmation;
        await apiClient.post("/clients", values);

        toast.success("Criado com sucesso! Redirecionando para o login...");
        push("/login");
    } catch (err) {
        toast.error((err as any)?.response?.data?.message || (err as any)?.response?.data?.erros?.join(", ") || "Ops! Algo deu errado.");
    }
    setLoading(false);
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      id="content-container"
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} minW={"md"} py={12} px={6}>
        <Stack align={"center"}>
          <Flex gap="3" align="center">
            <Image src="/imagens/92969c3c-5d00-4121-a391-1c3d06d2f072.png" height="50" width="70" alt='logo' />
            <Heading fontSize={"3xl"}>Crie sua conta</Heading>
          </Flex>
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
                <FormLabel>Nome Completo</FormLabel>
                <Input type="text" {...register("name")} />
              </FormControl>
              <FormControl id="phone" isRequired>
                <FormLabel>Telefone</FormLabel>
                <Input minLength={8} type="tel" {...register("phone")} />
              </FormControl>
              <FormControl id="CPF" isRequired>
                <FormLabel>CPF</FormLabel>
                <Input minLength={11} type="tel" {...register("CPF")} />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register("email")} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Senha</FormLabel>
                <PasswordInput register={register} name="password" />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Confirme sua senha</FormLabel>
                <PasswordInput
                  register={register}
                  name="password_confirmation"
                />
              </FormControl>
              <FormControl id="address" isRequired>
                <FormLabel>Endereço</FormLabel>
                <Input type="text" {...register("address")} />
              </FormControl>
              <Stack spacing={4}>
                <Button
                  type="submit"
                  colorScheme="purple"
                  loadingText="Criando..."
                  isLoading={loading}
                >
                  Criar conta
                </Button>

                <Flex gap={1} justify={"center"}>
                  Já tem uma conta?{" "}
                  <Link href="/login">
                    <Text color="purple.400">Acesse</Text>
                  </Link>
                </Flex>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
