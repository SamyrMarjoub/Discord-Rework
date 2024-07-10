'use client'

import { useRouter } from 'next/navigation'
import { auth } from '@/db/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import Sidebar from '../components/main/sidebar'
import Mainapp from '../components/main/mainapp'
import { Box } from '@chakra-ui/react'

export default function page() {

  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [userData, setUserData] = useState({})
  // const [SingleServData, setSingleServData] = useState({})


  useEffect(() => {

    setTimeout(() => {
      setIsReady(true)
    }, 500)

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
      {isReady ? <Box className='w-full flex h-[100vh] bg-blue-300'>
        <Sidebar />
        <Mainapp />
      </Box> : <></>}
    </>
  )
}
