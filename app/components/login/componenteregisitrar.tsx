import { Box, Input, Text } from '@chakra-ui/react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import React from 'react'
import { useState, useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../../../globalstate'
import randomColor from 'randomcolor'
import { auth, db } from '@/db/firebase'
import randomId from 'random-id'

export default function componenteregistrar() {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [username, setUsername] = useState('')
    const [dia, setDia] = useState('')
    const [mes, setMes] = useState('')
    const [ano, setAno] = useState('')
    const [focus, setFocus] = useState(false)
    const [userData, setUserData] = useState({})
    const [pagination, setPagination] = useGlobalState('pagination')
    const len = 4
    const pattern = '301'
    var color = randomColor();

    const generateYears = (startYear: number, endYear: number) => {
        const years = [];
        for (let year = endYear; year >= startYear; year--) {
            years.push(year.toString());
        }
        return years;
    };

    const generateMonths = () => {
        const months = [];
        for (let month = 1; month <= 12; month++) {
            months.push(month.toString().padStart(2, '0'));
        }
        return months;
    };

    const generateDays = () => {
        const days = [];
        for (let day = 1; day <= 31; day++) {
            days.push(day.toString().padStart(2, '0'));
        }
        return days;
    };

    const [dateData, setDateData] = useState({
        years: generateYears(1970, 2023),
        months: generateMonths(),
        days: generateDays()
    });

    useEffect(() => {
        console.log(userData);
    }, [userData]);


    function addUser(e: { preventDefault: () => void }) {

        e.preventDefault()
        const dataFormatada = `${dia}/${mes}/${ano}`

        createUserWithEmailAndPassword(auth, email, senha)
            .then(async (userCredential) => {

                await setDoc(doc(db, "usuarios", userCredential.user.uid), {
                    id: userCredential.user.uid,
                    username: username,
                    datanascimento: dataFormatada,
                    focus: focus,
                    uid: randomId(len, pattern),
                    servs: [],
                    bgIconColor: color,
                    timestamp: serverTimestamp()

                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });

        // setGeneralData({
        //     datanascimento: dataFormatada,
        //     username: username,
        //     focus: focus,
        //     timestamp: serverTimestamp(),
        //     id: localStorage.getItem('Uid')
        // })
        setEmail('')
        setSenha('')
        setUsername('')
        setPagination(2)
    }

    return (


        <Box className='bg-[#36393F] mobile:w-full mobile:h-full flex justify-center items-center w-[500px] h-[620px]'>
            <Box className='w-[90%] relative h-[90%] flex flex-col justify-center items-center'>

                <Text className='text-white text-[25px] font-bold'>Criar uma conta</Text>
                <form onSubmit={addUser}>
                    <Text className='text-[#B9BBBE] mt-5 
                          inline-block font-bold text-[12px] 
                          mobile:inline-block mobile:mt-5'>E-MAIL</Text>
                    <Input bg={'#202225'} border={'none'} autoComplete='new-password' required onChange={(e) => setEmail(e.target.value)}
                        type={'text'} value={email} className='w-full  p-2 outline-none text-[white] mt-2 bg-[#202225] h-[40px]' />
                    <Text className='text-[#B9BBBE] mt-[20px] inline-block font-bold text-[12px]'>NOME DE USUÁRIO</Text>
                    <Input bg={'#202225'}  border={'none'}  autoComplete='new-password' value={username} required onChange={(e) =>
                        setUsername(e.target.value)} type={'text'}
                        className='w-full mt-2  p-2 outline-none text-[white] bg-[#202225] h-[40px]' />
                    <Text className='text-[#B9BBBE] mt-[20px] inline-block font-bold text-[12px]'>SENHA</Text>
                    <Input bg={'#202225'}  border={'none'}  value={senha} autoComplete='new-password' required onChange={(e) => setSenha(e.target.value)}
                        type={'password'} className='w-full mt-2 outline-none text-[white] p-2 bg-[#202225] h-[40px]' />
                    <Text className='text-[#B9BBBE] mt-[20px] inline-block font-bold text-[12px]'>DATA DE NASCIMENTO</Text>

                    <Box className='w-full flex justify-between mt-2'>

                        <Box className='flex m-2 ml-0 flex-1 bg-[#202225] h-[40px]'>
                            <select onChange={(e) => setDia(e.target.value)} required className='w-full outline-none bg-transparent text-[#A3A6AA]'>
                                {dateData.years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </Box>

                        <Box className='flex m-2 flex-1 bg-[#202225] h-[40px]'>
                            <select onChange={(e) => setMes(e.target.value)} required className='w-full outline-none bg-transparent text-[#A3A6AA]'>
                                {dateData.months.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}

                            </select>
                        </Box>

                        <Box className='flex m-2 mr-0 flex-1 bg-[#202225] h-[40px]'>
                            <select onChange={(e) => setAno(e.target.value)} required className='w-full outline-none bg-transparent text-[#A3A6AA]'>
                                {dateData.days.map(day => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </Box>

                    </Box>
                    <Box className='w-full flex mt-2'>
                        <label className='relative chk mr-2'>
                            <Input height={'auto'} bg={'#202225'}  border={'none'}  checked={focus} onChange={(e) => setFocus(e.target.checked)} type={'checkbox'} className='invisible' />
                            <Text className='h-[25px] sticky mt-[-24px] w-[25px] bg-transparent border rounded-[5px] border-[#72767D] block'></Text>
                        </label>
                        <Box className='w-[94%]'>
                            <Text className='text-[#B9BBBE] mt-[-4px] inline-block text-[11px]'>{"(Opcional)"} Tudo bem me mandar e-mails com atualizações do Discord, dicas e ofertas especiais.
                                Você pode mudar isso a qualquer momento.</Text>
                        </Box>

                    </Box>
                    <Input border={'none'}  bg={'#5865F2'}  className='w-full mt-5 h-[40px]
                                   bg-[#5865F2] text-white font-bold cursor-pointer' value={'Continuar'} type={'submit'} />
                </form>
                <Box className='flex w-full mt-1 flex-col'>
                    <Text className='text-[#00AFF4] text-[13px] cursor-pointer' onClick={() => setGlobalState('pagination', 0)}>Já tem uma conta?</Text>
                    <Text mt={'0'} className='text-[#A3A6AA] inline-block mt-1 text-[11px] max-w-[90%]'>Ao registrar, você concorda com os <Text display={'inline'} className='text-[#00AFF4]'>termos de serviço</Text> e a <Text display={'inline'} className='text-[#00AFF4]'>politica de privacidade </Text>do Discord </Text>

                </Box>
            </Box>
        </Box>

    )

}
