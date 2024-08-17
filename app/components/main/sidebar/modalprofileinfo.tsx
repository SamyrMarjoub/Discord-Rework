import React, { useEffect, useRef } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { useGlobalState } from '@/globalstate'
import { FaCircle, FaDiscord, FaPen } from 'react-icons/fa'
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlinePermIdentity } from "react-icons/md";
import { useRouter } from 'next/navigation';

export default function Modalprofileinfo({ onClose, logOut }) {
    const [userData] = useGlobalState('userData');
    const modalRef = useRef(null);
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <Box
            ref={modalRef}
            display={'flex'}
            flexDir={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            transform={'translateY(-100%)'}
            width={'290px'}
            rounded={'15px'}
            height={'AUTO'}
            bg={'#111214'}
            position={'absolute'}
            top={'0px'}
            pb={'20px'}
        >
            <Box  width={'100%'} display={'flex'} justifyContent={'center'} bg={'red'} roundedTop={'15px'} height={'25%'}>
                <Box position={'relative'} display={'flex'} height={'120px'} justifyContent={'flex-end'} width={'90%'}>
                    <Box mt={'10px'} bg={'black'} width={'35px'} height={'35px'} rounded={'35px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <FaPen onClick={() => router.push('/profile')} cursor={'pointer'} fontSize={'14px'} color='white' />

                    </Box>
                    <Box
                        width={'100px'}
                        bottom={'-30%'}
                        pos={'absolute'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        height={'100px'}
                        rounded={'100px'}
                        left={'0px'}

                        bg={userData.bgIconColor} backgroundSize={'cover'} backgroundImage={userData.profilepicture}
                    >
                        {userData.profilepicture ? <></> : <FaDiscord color='white' fontSize={'55px'} />}
                        <FaCircle
                            fontSize={'20px'}
                            style={{ position: 'absolute', bottom: '10px', right: '1px' }}
                            color={'#23a55a'}
                        />
                    </Box>
                </Box>
            </Box>
            <Box width={'90%'} height={'75%'}>

                <Box mt={'60px'}>
                    <Text fontWeight={'800'} color={'white'}>
                        {userData.username} {' '}
                        <Text as={'span'} fontWeight={'400'} fontSize={'14px'} color={'white'}>
                            #{userData.uid}
                        </Text>
                    </Text>
                    <Text color={'white'} fontSize={'12px'}>
                        {userData.pronome}
                    </Text>
                    <Text fontSize={'14px'} mt={'15px'} color={'white'}>
                        {userData?.description
                        }
                    </Text>
                </Box>
                <Box display={'flex'} justifyContent={'center'} mt={'20px'} rounded={'10px'} bg={'#2f3236'} width={'100%'} height={'auto'}>
                    <Box width={'90%'} mt={'7.5px'} mb={'7.5px'} display={'flex'} alignItems={'center'} flexDir={'column'}>
                        <Box _hover={{ 'bg': '#36393F' }} cursor={'pointer'} transition={'0.2s all'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} height={'50px'}>
                            <Box display={'flex'}>
                                <FaCircle fontSize={'16px'} color={'#23a55a'} />
                                <Text ml={'10px'} fontSize={'14px'} lineHeight={'15px'} color={'white'}>
                                    Online
                                </Text>
                            </Box>
                            <Box>
                                <MdKeyboardArrowRight fontSize={'18px'} color='white' />
                            </Box>
                        </Box>
                        <Box width={'95%'} height={'2px'} bg={'#3e4046'}></Box>
                        <Box onClick={() => { logOut() }} _hover={{ 'bg': '#36393F' }} transition={'0.2s all'} cursor={'pointer'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} height={'50px'}>
                            <Box display={'flex'}>
                                <MdAccountCircle fontSize={'18px'} color={'white'} />
                                <Text ml={'10px'} fontSize={'14px'} lineHeight={'15px'} color={'white'}>
                                    Sair da conta
                                </Text>
                            </Box>
                            <Box>
                                <MdKeyboardArrowRight fontSize={'18px'} color='white' />
                            </Box>
                        </Box>
                        <Box width={'95%'} height={'2px'} bg={'#3e4046'}></Box>
                        <Box _hover={{ 'bg': '#36393F' }} cursor={'pointer'} transition={'0.2s all'} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} height={'50px'}>
                            <Box display={'flex'}>
                                <MdOutlinePermIdentity fontSize={'18px'} color={'white'} />
                                <Text ml={'10px'} fontSize={'14px'} lineHeight={'15px'} color={'white'}>
                                    Copiar ID do usuário
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
