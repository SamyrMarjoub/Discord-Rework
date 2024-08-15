'use client'
import { auth } from '@/db/firebase'
import { Box } from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Loading from '../components/profile/loading'

export default function page() {
    const router = useRouter()
    const [isReady, setIsReady] = useState(false)
    const [userData, setUserData] = useState({})



    useEffect(() => {
        setTimeout(() => {
            setIsReady(true)
        }, 2000)

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserData(user)
            } else {
                router.replace('/login/signin')
            }
        });

    }, [router, userData])


    return (
        <>
      
            {isReady ? <Box width='100%' height='100vh' bg='#2b2d31'></Box> : <Loading/>}
        </>
    )
}
