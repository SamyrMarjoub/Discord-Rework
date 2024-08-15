import { Box, Text, keyframes } from '@chakra-ui/react'
import React from 'react'
import { FaDiscord } from 'react-icons/fa'
import { useState, useEffect } from 'react';

export default function loading() {
    const [advice, setAdvice] = useState('');
    const dicas = [
        "Você pode usar o Modo Streamer para ocultar detalhes pessoais enquanto transmite.",
        "Você pode digitar /tableflip e /unflip para animar suas mensagens.",
        "Caracteres como @, #, ! e * irão restringir os resultados do Quick Switcher.",
        "Clique no nome de um servidor no seletor de emojis para ocultar o emoji daquele servidor.",
        "Passe o cursor sobre um GIF e clique na estrela para salvá-lo nos seus favoritos.",
        "O papel mais alto de um usuário define a cor desse usuário.",
        "Um ícone de microfone vermelho significa que a pessoa foi silenciada por um administrador do servidor.",
        "Você pode silenciar temporariamente um servidor ou canal clicando com o botão direito sobre ele.",
        "Clique na sua foto de perfil no canto inferior esquerdo para definir um status personalizado.",
        "Mensagens diretas em grupo podem ter até dez membros.",
        "Clique na bússola na sua lista de servidores para encontrar novos servidores.",
        "Arraste e solte servidores um em cima do outro para criar pastas de servidores.",
        "Digite /tenor ou /giphy + qualquer coisa para encontrar um GIF sobre esse tópico!",
        "Compartilhe o que você está jogando usando as configurações de Atividade do Jogo.",
        "Selecione o texto na sua barra de chat para negritar, usar itálico e mais.",
        "Oculte canais silenciados em um servidor clicando com o botão direito no nome do servidor.",
        "Personalize a aparência do Discord no menu de configurações do usuário.",
        "Conecte suas contas de redes sociais favoritas nas configurações de conexões.",
        "Você pode criar categorias de canais para agrupar e organizar seus canais.",
        "Você pode entrar em até 100 servidores, e até 200 com Nitro!",
        "Você pode arrastar e soltar arquivos no Discord para enviá-los.",
        "Altere o volume de cada participante clicando com o botão direito sobre ele em uma chamada."
    ];
//     const spin = keyframes`
//     0% {
//       transform: rotate(0deg);
//       animation-timing-function: ease-in;
//     }
//     100% {
//       transform: rotate(360deg);
//       animation-timing-function: ease-out;
//     }
//   `;
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * dicas.length);
        setAdvice(dicas[randomIndex]);
    }, []);
    return (
        <Box width='100%' height='100vh' bg='#2b2d31' display={'flex'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
            <Box
               
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <FaDiscord color='white' fontSize='100px' />
            </Box>


            <Box>
                <Text textAlign={'center'} fontSize={'17px'} mt={'25px'} color={'white'} fontWeight={'500'} textTransform={'uppercase'}>Você sabia que </Text>
                <Text mt={'10px'} color={'#c1c4c7'} maxW={'350px'} fontSize={'15px'} textAlign={'center'}>{advice}</Text>

            </Box>
        </Box>
    )
}
