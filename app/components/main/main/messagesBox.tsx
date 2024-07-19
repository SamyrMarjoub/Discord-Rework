import { useGlobalState } from '@/globalstate';
import { Box, Input, Stack, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { FaDiscord } from 'react-icons/fa';

export default function messagesBox() {

    const [userData, setUserData] = useGlobalState('userData')

    useEffect(() => {
        console.log(userData)
    }, [])

    const scrollStyle = {
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            backgroundColor: '#2b2d31',
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: '#1a1b1e',
            borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
        },
    };

    return (
        <Box
            height={["calc(100vh - 50px)"]}
            display="flex"
            flexDirection="column"
            overflow="hidden"
            width="100%"
        >
            <Box
                css={scrollStyle}
                flex="1"
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"

                overflowY="auto"
                width="100%"
                p="4"
            >
                <Stack spacing="3">
                    {/* <Text color="gray.500">Mensagem 1</Text>
                    <Text color="gray.500">Mensagem 2</Text>
                    <Text color="gray.500">Mensagem 3</Text> */}
                    <Box w={'100%'} height={'auto'} minH={'55px'} display={'flex'}>
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'70px'} height={'55px'}>
                            <Box bg={userData.bgIconColor} height={'40px'} width={'40px'} borderRadius={'40px'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                                <FaDiscord fontSize={'25px'} color='white' />
                            </Box>
                        </Box>
                        <Box flex={'1'}>
                            <Box width={'100%'} display={'flex'} flexDir={'column'} height={'100%'}>
                                <Text mt={'5px'} color={'white'} as={'span'}>{userData.username}</Text>
                                <Text mb={'-2px'} fontSize={'16px'} color={'#96989D'}>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</Text>

                            </Box>
                        </Box>

                    </Box>

                    {/* Adicione mais mensagens aqui */}

                </Stack>
            </Box>
            <Box
                p="4"
                pt={'0px'}

            >
                <Input
                    bg="#383a40"
                    placeholder="Digite sua mensagem..."
                    size="lg"
                    border="none"
                    color="white" // Para que o texto seja visível em fundo escuro
                />
            </Box>
        </Box>
    )
}
