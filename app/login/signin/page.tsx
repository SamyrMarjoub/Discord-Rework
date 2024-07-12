'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Box } from '@chakra-ui/react'
import bgImageDiscord from '@/public/discordloginbgimage.png'
import ComponenteCriarConta from '@/app/components/login/componentecriarconta'
import ComponenteLogin from '@/app/components/login/componentelogin'
import ComponenteRegistrar from '@/app/components/login/componenteregisitrar'
import { useGlobalState } from '@/globalState'

export default function main() {

  const router = useRouter()
  const [pagination, setPagination] = useGlobalState('pagination')
  const [LoginRegisterInfo, setLoginRegisterInfo] = useState('')
  const [LoginPass, setLoginPass] = useState('')

  useEffect(() => {
    if (localStorage.getItem('logged')) {
      router.replace('/main')
    }
  }, [router])

  return (

    <Box w={'100%'} h={'100vh'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
      <Image src={bgImageDiscord} fill style={{ objectFit: 'cover' }} alt={''} />

      <Box zIndex={'999'}>
        {
          pagination === 0 ? <ComponenteLogin /> : pagination === 1 ? <ComponenteRegistrar /> : <ComponenteCriarConta LoginRegisterInfo={LoginRegisterInfo} LoginPass={LoginPass} />

        }
      </Box>

    </Box>

  )
}
