"use client";
import { Toaster } from 'react-hot-toast'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

function App({ Component, pageProps }: any) {
  return (
    <>
    <Head>
      <title>Eventos Crie_TI</title>
    </Head>

    <ChakraProvider>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </ChakraProvider>
    </>
  )
}

export default App