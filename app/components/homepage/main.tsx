import React from 'react'
import { Box, Text, Button } from '@chakra-ui/react'
import Image from 'next/image'
import img1 from '../../../public/img1.svg'
import { FaDownload } from 'react-icons/fa'
import img2 from '../../../public/img2.svg'

export default function main() {
    return (
        <Box className='w-full relative overflow-hidden disconuvem flex justify-center items-center'>
            <Box className='w-[1200px] relative'>
                <Box as='main' className={`min-h-[550px] relative mobile:p-5 tablets:min-h-[700px] query:items-start query:p-10  smalltablets:justify-start  W-full flex flex-col items-center justify-center`}>
                    <Text className='text-[70px] smalltablets:mt-[30px] smallmobile:max-w-sm smallmobile:text-center  query:max-w-[500px] smalltablets:text-[30px] query:text-start query:leading-[60px] fontBold text-center font-bold text-white'>IMAGINE A PLACE...</Text>
                    <Text className='text-white mobile:text-[13px] smallmobile:max-w-sm smallmobile:text-center query:mt-[30px] smalltablets:mt-0 query:text-start max-w-2xl tracking-wide font-semibold text-center'>
                        ...where you can belong to a school club, a gaming group, or a worldwide art community.
                        Where just you and a handful of friends can spend time together.
                        A place that makes it easy to talk every day and hang out more often.
                    </Text>
                    <Box className='flex query:flex-col  mt-6'>
                        <Button color={'black'}  h={'50px'} borderRadius={'1.5rem'} className='w-[300px] mr-3 flex items-center
         justify-center bg-white relative  h-[50px] rounded-3xl'> <FaDownload className='absolute left-[40px]' />Download for Windows</Button>
                        <Button color={'white'} bg={'#23272a'} h={'50px'} borderRadius={'1.5rem'} className='w-[300px] query:mt-5   text-white rounded-3xl' >Open Discord in your Browser</Button>

                    </Box>
                    <Image className='absolute hidden smalltablets:block bottom-0 left-[-50px]' src={img2} alt='' width={600} />


                </Box>

            </Box>


        </Box>
    )
}
