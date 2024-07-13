'use client'
import { auth } from '@/db/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Box, Text, Input } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import codbarra from '@/public/codbarra.png'
import discordlogo from '@/public/logo2.svg'
import { useGlobalState, setGlobalState } from '../../../globalstate'

export default function componentelogin() {

  const [emailTel, setEmailTel] = useState('')
  const [senha, setSenha] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [pagination, setPagination] = useGlobalState('pagination')
  const router = useRouter()


  function submitLogin(e: { preventDefault: () => void }) {
    e.preventDefault()
    // const q = query(collection(db, 'usuarios'), where('email', '==', emailTel), where('senha', '==', senha))
    // const querySnapshot = await getDocs(q);
    // const spans = document.querySelectorAll('.spanL')

    // if (querySnapshot.empty) {
    //     for (let i = 0; i < spans.length; i++) {
    //         spans[i].classList.add('spanLError')
    //     }
    //     setLoginError(true)
    // } else {

    //     console.log(querySnapshot.empty)
    // }
    // console.log(user)

    signInWithEmailAndPassword(auth, emailTel, senha)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('logou')
        localStorage.setItem('logged', 'true')
        localStorage.setItem('Uid', user.uid)
        router.push('/main')
        console.log(user.uid)

      })
      .catch((error) => {
        const spans = document.querySelectorAll('.spanL')
        for (let i = 0; i < spans.length; i++) {
          spans[i].classList.add('spanLError')
        }
        setLoginError(true)
        console.log(error)

      });

  }

  return (

    <Box className='w-[780px] flex tablets2:w-[500px] mobile:h-[100%] tablets2:h-[380px] justify-center items-center h-[405px] bg-[#36393F]'>
      <Box className='w-[90%] mobile:h-[95%]  flex  h-[85%]'>
        <Box className='w-[58%] tablets2:w-full flex flex-col items-center to-blue-500'>
          <Box className='hidden mobile:flex justify-between'>
            <Image src={discordlogo} width={130} alt='' />

          </Box>
          <Text className='text-white text-[23px] mobile:mt-5 font-bold'>Boas-vindas de volta!</Text>
          <Text className='text-[#A3A6AA] mobile:mt-2 tablets2:hidden'>Estamos muito animados em te ver novamente!</Text>
          <Box className='w-full mt-2 flex justify-between flex-col'>
            <form onSubmit={submitLogin}>
              <Text className='text-[#B9BBBE] spanL font-bold text-[12px] mobile:inline-block mobile:mt-5'>E-MAIL OU NÚMERO DE TELEFONE
                {loginError === true ? (<Text as={'span'} className='text-[#F38688] text-[12px]'> - Login ou senha invalidos</Text>) : <></>} {loginError === false ? "*" : <></>}</Text>
              <Input border={'none'} bg='#202225' onChange={(e) => setEmailTel(e.target.value)} autoComplete='new-password' type={'text'} className='w-full p-2 text-white outline-none mt-2 bg-[#202225] h-[40px]' />
              <Text className='text-[#B9BBBE] spanL mt-[20px] inline-block font-bold text-[12px]'>SENHA  {loginError === true ? (<Text as={'span'} className='text-[#F38688] text-[12px]'> - Login ou senha invalidos</Text>) : <></>} {loginError === false ? "*" : <></>}</Text>
              <Input border={'none'} bg='#202225' onChange={(e) => setSenha(e.target.value)} autoComplete='new-password' type={'password'} className='w-full  p-2 text-white  mt-2 outline-none bg-[#202225] h-[40px]' />
              <Text className='text-[#00AFF4] mt-[5px] inline-block font-medium text-[13px]'>Esqueçeu sua senha? </Text>
              <Input border={'none'} bg='#5865F2' cursor={'pointer'} className='w-full mt-5 h-[40px]
                                     bg-[#5865F2] text-white font-bold' value={'Entrar'} type={'submit'} />
            </form>
            <Text className='inline-block text-[13px]
                                 text-[#A3A6AA] mt-2'>Precisando de uma conta? <Text as={'span'} display={'inline'} onClick={() => [setGlobalState('pagination', 1), console.log(pagination)]} className='text-[#00AFF4] cursor-pointer'>Registre-se</Text> </Text>
          </Box>
        </Box>
        <Box className='w-[42%] tablets2:hidden flex justify-center flex-col items-end'>
          <Box className='w-[90%] flex justify-center flex-col items-center'>
            <Box className='w-[66%] rounded-md flex justify-center items-center h-[175px] bg-white'>
              <Image alt='' src={codbarra} />
              <Image className='absolute' width={50} src={discordlogo} alt='' />
            </Box>
            <Text className='inline-block text-[20px] font-bold text-white mt-5'>Entrar com Código QR</Text>
            <Text className='text-[#A3A6AA] inline-block mt-2 font-medium text-center
                                 max-w-[90%] text-[15px]'>Escaneie isto com o
              <Text as={'span'} className='text-[#DCDDDE] font-normal'> app móvel do Discord</Text>  para fazer login imediatamente</Text>
          </Box>

        </Box>

      </Box>
    </Box>

  )

}

