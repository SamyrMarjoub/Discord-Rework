import React from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import keyAccount from '@/public/keyAccoutn.svg'
import { useGlobalState, setGlobalState } from '../../../globalstate'


export default function componentecriarconta(props: { LoginRegisterInfo: string; LoginPass: string; }) {

    const router = useRouter()
    const [pagination, setPagination] = useGlobalState('pagination')
    function teste() {
        console.log('foi')
        setGlobalState('pagination', 0)
        console.log(pagination)
    }
    // function AutoLogin() {
    //     signInWithEmailAndPassword(auth, props.LoginRegisterInfo, props.LoginPass)

    //     .then((userCredential) => {
    //             const user = userCredential.user;
    //             localStorage.setItem('logged', 'true')
    //             router.push('/login/signin')

    //         })
    //         .catch((error) => {
    //             return console.error(error)
    //         });
    // }

    return (
        <Box className={`w-full h-[100vh] flex justify-center items-center bg-img`}>
            <Box className='w-[480px] shadow flex justify-center items-center h-[350px] rounded-[10px] bg-[#36393F]'>
                <Box className='w-[90%] flex-col flex items-center h-[90%] relative'>
                    <Image src={keyAccount} alt='' className='mt-5' />
                    <Text className='block text-white text-[23px] font-bold mt-3'>Criar uma conta</Text>
                    <Text className='block text-[#A3A6AA]'>Bip bup. Bip big?</Text>
                    <Button onClick={teste} className='w-[50%] bg-[#5865F2] rounded-3xl
                       text-white text-[17px] uppercase font-bold tracking-[2px] h-[40px] mt-5'>Continuar</Button>
                </Box>
            </Box>

        </Box>
    )
}


