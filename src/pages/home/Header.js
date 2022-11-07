import { Button, Flex, View } from '@aws-amplify/ui-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import './styles.css'

export default function Header (props) {
  const navigate = useNavigate()
  const go2 = path => () => navigate(path)

  return (
    <View className='header'>
      <Flex width='100%'>
        <Button onClick={go2('/')}>🏠 Inicio</Button>
        <Button onClick={go2('/profile')}>😎 Perfil</Button>
        <Button alignSelf={'flex-end'} onClick={props.signOut}>
          🚪 Cerrar Sesión
        </Button>
      </Flex>
    </View>
  )
}
