'use client'
import React from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { provider } from '@/db/firebase'


export default function header() {

    const router = useRouter()
    const [user, setUser] = useState('')

    useEffect(() => {
        const loggedUser = localStorage.getItem('logged');
        setUser(loggedUser ? loggedUser : ''); // Provide a default value
    }, []);


    return (
        <Box className='w-[1200px]  queryH:w-[90%]'>
            <Box className='flex justify-between h-[70px] w-full'>
                <Box className='w-[20%] tablets:justify-start tablets:w-[50%] flex items-center justify-center'>
                    <FaDiscord className='text-[35px] text-white' />
                    <Text className='text-white font-bold text-[20px] pl-2 fonte'>Discord</Text>
                </Box>
                <Box className='w-[70%] tablets:hidden  '>
                    <ul className='items-center h-full flex justify-center'>
                        <li className='inline p-3 font-bold text-white'>Download</li>
                        <li className='inline p-3 font-bold text-white'>Nitro</li>
                        <li className='inline p-3 font-bold text-white'>Discover</li>
                        <li className='inline p-3 font-bold text-white'>Safety</li>
                        <li className='inline p-3 font-bold text-white'>Support</li>
                        <li className='inline p-3 font-bold text-white'>Blog</li>
                        <li className='inline p-3 font-bold text-white' >Careers</li>

                    </ul>
                </Box>
                <Box className='w-[10%] tablets:justify-end tablets:w-[50%] flex items-center  bg-red'>
                    <Button color={'black'} className='w-full tablets:hidden
             h-[40px] queryH:text-[13px]
              rounded-3xl bg-white
               text-[14px]' onClick={() => {
                            !user ? router.push('/login/signin')
                                : router.push('/main')
                        }}>
                        {!user ? "Login" : "Open Discord"}</Button>
                    <GiHamburgerMenu className='text-white ml-3 hidden tablets:block text-[35px]' />
                </Box>

            </Box>
        </Box>
    )
}
