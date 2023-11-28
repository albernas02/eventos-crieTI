"use client";
import { Toaster } from 'react-hot-toast'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import { AuthProvider } from '@/contexts/AuthContext';

function App({ Component, pageProps }: any) {
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