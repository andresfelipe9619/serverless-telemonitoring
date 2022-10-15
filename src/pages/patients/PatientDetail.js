import React from 'react'
import { Heading, Flex, Image, Card, Button } from '@aws-amplify/ui-react'
import logo from '../../logo.svg'
import { useNavigate } from 'react-router-dom'

export default function PatientDetail ({ user }) {
  const navigate = useNavigate()
  const go2 = path => () => navigate(path)

  return (
    <Flex
      direction={'column'}
      justifyContent='center'
      alignContent={'center'}
      className='App-header'
    >
      <Card variation='elevated'>
        <Heading level={1}>DATOS DEL PACIENTE</Heading>
        <Image
          alt='Foto Paciente'
          src={logo}
          objectFit='initial'
          objectPosition='50% 50%'
          backgroundColor='initial'
          height='30%'
          width='30%'
          opacity='100%'
        />
        <Heading level={1}>Hello {user.username}</Heading>
      </Card>
      <Card variation='elevated'>
        <Heading level={1}>VISUALIZACIÓN DE LECTURA SIGNOS VITALES </Heading>
        <Button onClick={go2(`/reports/${user.username}`)}>Historial</Button>
      </Card>
    </Flex>
  )
}
