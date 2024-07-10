import Footer from "./components/homepage/footer";
import Header from "./components/homepage/header";
import Main from "./components/homepage/main";
import Herodivs from "./components/homepage/herodivs";
import Head from 'next/head'
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box className='w-full bg-[#404eed] flex flex-col items-center justify-center'>
      <Head>
        <title>Discord</title>
        <link rel="shortcut icon" href='discord-icon.svg' />

      </Head>
      <Header />
      <Main />
      <Herodivs />
      <Footer />
    </Box>
  );
}
