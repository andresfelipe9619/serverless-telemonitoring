import React from 'react'
import { Heading, Flex, Image, Card, Button } from '@aws-amplify/ui-react'
import logo from '../../logo.svg'
import Header from '../home/Header'
import { useNavigate } from 'react-router-dom'

export default function PatientDetail ({ user, signOut }) {
  const navigate = useNavigate()
  const go2 = path => () => navigate(path)

  return (
    <Flex
      direction={'column'}
      justifyContent='center'
      alignContent={'center'}
      className='App-header'
    >
      <Card>
        <Header>DATOS DEL PACIENTE</Header>
        <Image
          alt='Foto Paciente'
          src={logo}
          objectFit='initial'
          objectPosition='50% 50%'
          backgroundColor='initial'
          height='75%'
          width='75%'
          opacity='100%'
        />
        <Heading level={1}>Hello {user.username}</Heading>
      </Card>
      <Card>
        <Header>VISUALIZACIÓN DE LECTURA SIGNOS VITALES </Header>
        <Button onClick={go2(`/reports/${user.username}`)}>Historial</Button>
      </Card>
    </Flex>
  )
}
