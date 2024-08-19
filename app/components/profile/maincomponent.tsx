import { Box, Button, Input, Text, Textarea } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaCircle, FaDiscord } from 'react-icons/fa';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRouter } from 'next/navigation'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '@/db/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';

export default function maincomponent() {

    const [userData, setUserData] = useState('userData');
    const [name, setName] = useState('')
    const [pronome, setPronome] = useState('')
    const [description, setDescription] = useState('')
    const [alteracao, setAlteracao] = useState(false)
    const [docUserRef, setDocUserRef] = useState(null)
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState(null)
   

    async function getUserData() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const docRef = doc(db, "usuarios", user.uid);
    
                // Evitar múltiplos listeners, assegurando que apenas um está ativo
                if (!docUserRef) {
                    const unsubscribe = onSnapshot(docRef, (docSnap) => {
                        if (docSnap.exists()) {
                            setUserData(docSnap.data());
                            setDocUserRef(docRef);
                        }
                    }, (error) => {
                        console.error("Erro ao escutar documento:", error);
                    });
    
                    // Retornar função de cleanup para garantir que o listener seja removido
                    return () => unsubscribe();
                }
            }
        });
    }
    
    const updateDocument = async () => {
        if (docUserRef) {
            try {
                // Primeiro, obter o documento atual para verificar quais campos existem
                const docSnap = await getDoc(docUserRef);

                if (docSnap.exists()) {
                    const updateFields = {};

                    // Verificar se cada campo tem um valor não vazio e adicioná-lo ao objeto de atualização
                    if (name.trim() !== '') {
                        updateFields['username'] = name;
                    }
                    if (pronome.trim() !== '') {
                        updateFields['pronome'] = pronome;
                    }
                    if (description.trim() !== '') {
                        updateFields['description'] = description;
                    }
                    if (imageUrl.trim() !== '') {
                        // Criar uma referência para o arquivo no Firebase Storage
                        const imgRef = ref(storage, `usuarios/${userData.uid}/userProfilePicture`);

                        // Fazer o upload da imagem
                        await uploadString(imgRef, imageUrl, 'data_url');

                        // Obter a URL de download da imagem
                        const downloadUrl = await getDownloadURL(imgRef);

                        // Atualizar o Firestore com a URL da imagem
                        updateFields['profilepicture'] = downloadUrl;
                    }

                    // Se houver campos para atualizar, faça a atualização
                    if (Object.keys(updateFields).length > 0) {
                        await updateDoc(docUserRef, updateFields);
                        console.log('Documento atualizado com sucesso!');
                    } else {
                        console.log('Nenhum campo para atualizar.');
                    }
                } else {
                    console.error('Documento não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao atualizar o documento: ', error);
            }
        } else {
            console.error('Referência do documento não definida.');
        }
    };

   

    useEffect(() => {
        getUserData()
    }, [])


    useEffect(() => {
        if (name !== "" || pronome !== "" || description !== "" || imageUrl !== null) setAlteracao(true)
        else setAlteracao(false)
    }, [name, pronome, description, imageUrl])


    const handleReset = () => {
        setName('');
        setPronome('');
        setDescription('');
        setImageUrl(null)
    };

    function ComponenteSalvarAlteracao() {
        return (
            <Box padding={'10px'} height={'50px'} bottom={'10px'} bg={'#111214'} display={'flex'} position={'absolute'} width={'100%'}>
                <Box width={'70%'} height={'100%'} display={'flex'} alignItems={'center'}>
                    <Text color={"#a3a5a8"}>Cuidado -- você tem alterações que não foram salvas!</Text>
                </Box>
                <Box justifyContent={'space-between'} display={'flex'} width={'30%'}>
                    <Button onClick={handleReset} _hover={{ 'bg': "none", "color": "white" }} height={'30px'} fontSize={'14px'} bg={'transparent'} color={'#a3a5a8'}>Redefinir</Button>
                    <Button _hover={'none'} height={'30px'} fontSize={'14px'} bg={'#248046'} color={'white'} onClick={() => updateDocument()}>Salvar alerações</Button>
                </Box>


            </Box>
        )
    }

    function fileImage(e) {
        e.preventDefault()
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setImageUrl(reader.result);
            // console.log(reader.result)
        }
        reader.readAsDataURL(file)

    }

    const handleButtonClick = () => {
        document.getElementById('file-input').click();
    };

    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100vh'} bg={'#313338'}>
            <Box pos={'relative'} width={'40%'} height={'100%'}>
                {alteracao ? <ComponenteSalvarAlteracao /> : <></>}

                <Box mt={'100px'} display={'flex'} justifyContent={'space-between'}>
                    <Box width={'50%'}>
                        <Text fontSize={'20px'} color={'white'}>Perfis</Text>

                    </Box>
                    <Box width={'50%'} display={'flex'} flexDirection={'column'} alignItems={'flex-end'}>
                        <IoIosCloseCircleOutline cursor={'pointer'} onClick={() => router.push('/main')} fontSize={'40px'} color={'white'} />
                        <Text mr={'9px'} fontSize={'14px'} color={'white'}>ESC</Text>
                    </Box>

                </Box>
                <Box mt="20px" display="flex" width="100%" borderBottom={'1px solid #3f4147'}>
                    <Box cursor="pointer" height="35px" width="140px">
                        <Text
                            display="inline-block"
                            position="relative"
                            paddingBottom="15px"
                            color="white"
                            fontSize="16px"
                            _after={{
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                bottom: '1px',
                                height: '2px',
                                width: '100%',
                                backgroundColor: '#949cf7', // Cor da borda azul
                            }}
                        >
                            Perfil do usuário
                        </Text>
                    </Box>
                    <Box cursor="not-allowed" height="35px" width="140px">
                        <Text fontSize="16px" color="#adbac1">
                            Perfil do servidor
                        </Text>
                    </Box>
                </Box>
                <Box display={'flex'} width={'100%'} height={'200px'}>
                    <Box mt={'30px'} width={'60%'}>
                        <Box paddingRight={'30px'} height={'95px'}>
                            <Box
                                borderBottom={'1px solid #3f4147'}
                                height={'100%'}
                                boxSizing="content-box"
                                paddingBottom="10px"
                            >
                                <Text
                                    textTransform={'uppercase'}
                                    fontSize={'12px'}
                                    fontWeight={'700'}
                                    mb={'10px'}
                                    color={'#adbac1'}
                                >
                                    Nome exibido
                                </Text>
                                <Input
                                    borderRadius={'5px'}
                                    color={'white'}
                                    backgroundColor={'#1e1f22'}
                                    height={'40px'}
                                    border={'none'}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={50}
                                />
                            </Box>
                        </Box>

                        <Box paddingRight={'30px'} mt={'20px'} height={'95px'}>
                            <Box
                                borderBottom={'1px solid #3f4147'}
                                height={'100%'}
                                boxSizing="content-box"
                                paddingBottom="10px"
                            >
                                <Text
                                    textTransform={'uppercase'}
                                    fontSize={'12px'}
                                    fontWeight={'700'}
                                    mb={'10px'}
                                    color={'#adbac1'}
                                >
                                    Pronomes
                                </Text>
                                <Input
                                    borderRadius={'5px'}
                                    color={'white'}
                                    backgroundColor={'#1e1f22'}
                                    height={'40px'}
                                    border={'none'}
                                    type="text"
                                    value={pronome}
                                    onChange={(e) => setPronome(e.target.value)}
                                    maxLength={20}

                                />
                            </Box>
                        </Box>

                        <Box paddingRight={'30px'} mt={'20px'} height={'95px'}>
                            <Box
                                borderBottom={'1px solid #3f4147'}
                                height={'100%'}
                                boxSizing="content-box"
                                paddingBottom="10px"
                            >
                                <Text
                                    textTransform={'uppercase'}
                                    fontSize={'12px'}
                                    fontWeight={'700'}
                                    mb={'10px'}
                                    color={'#adbac1'}
                                >
                                    Avatar
                                </Text>
                                <Button onClick={handleButtonClick} _hover={'none'} height={'40px'} fontSize={'15px'} color={'white'} bg='#5865f2'>Mudar Avatar</Button>
                                <Input id='file-input' onChange={fileImage} style={{ display: 'none' }} type='file' />
                                <Button _hover={{ 'bg': "none", "color": "white" }} cursor={'not-allowed'} height={'40px'} fontSize={'15px'} color={'#adbac1'} bg={'transparent'}>Remover Avatar</Button>

                            </Box>
                        </Box>

                        <Box paddingRight={'30px'} mt={'20px'} height={'95px'}>
                            <Box
                                borderBottom={'1px solid #3f4147'}
                                height={'100%'}
                                boxSizing="content-box"
                                paddingBottom="10px"
                            >
                                <Text
                                    textTransform={'uppercase'}
                                    fontSize={'12px'}
                                    fontWeight={'700'}
                                    mb={'10px'}
                                    color={'#adbac1'}
                                >
                                    Sobre mim..
                                </Text>
                                <Textarea
                                    borderRadius={'5px'}
                                    color={'white'}
                                    backgroundColor={'#1e1f22'}
                                    rows="5"
                                    border={'none'}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={123}

                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* //previa */}
                    <Box mt={'30px'} width={'40%'}>
                        <Text textTransform={'uppercase'} fontSize={'12px'} fontWeight={'700'} mb={'10px'} color={'#adbac1'}>PRÉVIA</Text>
                        <Box height={'auto'} width={'100%'}>

                            <Box

                                display={'flex'}
                                flexDir={'column'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                width={'100%'}
                                rounded={'15px'}
                                height={'auto'}
                                bg={'#111214'}
                                pb={'20px'}
                            >
                                <Box width={'100%'} display={'flex'} pos={'relative'} bg={'red'} roundedTop={'15px'} height={'80px'}>
                                    <Box
                                        width={'80px'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        height={'80px'}
                                        rounded={'80px'}
                                        bg={userData?.bgIconColor}
                                        position={'absolute'}
                                        bottom={'-50%'}
                                        left={'15px'}
                                    >
                                        {userData.profilepicture ? <Image style={{'borderRadius':'80px'}} alt="Profile Picture" layout="fill"  objectFit="cover"  src={userData.profilepicture} /> : <FaDiscord fontSize={'40px'} color='white' />                                    }
                                        <FaCircle
                                            fontSize={'20px'}
                                            style={{ position: 'absolute', bottom: '5px', right: '1px' }}
                                            color={'#23a55a'}
                                        />
                                    </Box>
                                </Box>
                               
                                <Box position={'relative'} width={'90%'} height={'75%'}>

                                    <Box mt={'70px'}>
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
                                    <Box display={'flex'} justifyContent={'center'} mt={'20px'} rounded={'10px'} width={'100%'} height={'auto'}>
                                        <Box width={'100%'} display={'flex'} alignItems={'center'} flexDir={'column'}>
                                            <Button _hover={'none'} bg={'#4e5058'} color={'white'} width={'100%'}>Botão Exemplo</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>



                        </Box>

                    </Box>

                </Box>
            </Box>
        </Box>
    )
}
