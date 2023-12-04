"use client";
import { Toaster } from 'react-hot-toast'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import { AuthProvider } from '@/contexts/AuthContext';
import moment from 'moment';
import 'moment/locale/pt-br';

function App({ Component, pageProps }: any) {
  moment.locale('pt-br');

  return (
    <>
      <Head>
        <title>Eventos Crie_TI</title>
      </Head>

      <ChakraProvider>
        <Toaster position="top-right" />
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </>
  )
}

export default App