import { Box, Text, Stack, Button,Input } from '@chakra-ui/react'
import React from 'react'
import { FaUserFriends } from "react-icons/fa";


export default function friendsComponent() {

    function HeaderFriendsComponent() {
        return (
            <Box  width={'100%'} display={'flex'} alignItems={'center'} height={'40px'}>
                <Stack mr={'15px'}  flexDirection={'row'} alignItems={'center'}>
                    <FaUserFriends style={{ marginRight: '10px' }} fontSize={'20px'} color='white' />
                    <Text color={'white'}>Amigos</Text>
                </Stack>
                <Box width={'1px'} height={'60%'} bg={'gray'}></Box>
                <Stack ml={'15px'} mr={'25px'}  justifyContent={'center'} alignContent={'center'}>
                    <Text color={'#96989D'}>Disponivel</Text>

                </Stack>
                <Stack mr={'25px'}  justifyContent={'center'} alignContent={'center'}>
                    <Text color={'#96989D'}>Todos</Text>

                </Stack>
                <Stack mr={'25px'} justifyContent={'center'} alignContent={'center'}>
                    <Text color={'#96989D'}>Pendente</Text>

                </Stack>
                <Stack mr={'25px'}  justifyContent={'center'} alignContent={'center'}>
                    <Text color={'#96989D'}>Bloqueado</Text>

                </Stack>
                <Stack  justifyContent={'center'} alignContent={'center'}>

                    <Button bg={'#248046'} height={'25px'} fontSize={'14px'} color={'white'}>Adicionar amigo</Button>

                </Stack>


            </Box>
        )
    }

    function SearchinputComponent(){
        return(
            <Box w={'100%'} height={'auto'}>
                <Input bg={'#202225'} border='none' mt={'20px'} w={'100%'} height={'40px'}placeholder='Buscar' />
            </Box>
        )
    }

    return (
        <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
            <Box width={'95%'} height={'100%'}>
                <HeaderFriendsComponent />
                <SearchinputComponent/>
            </Box>
        </Box>
    )
}
