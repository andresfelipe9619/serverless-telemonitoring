import { Button, Flex, View } from '@aws-amplify/ui-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import './styles.css'

export default function Header (props) {
  const navigate = useNavigate()
  const go2 = path => () => navigate(path)

  return (
    <View className='header'>
      <Flex>
        <Button onClick={go2('/')}>Inicio</Button>
        <Button onClick={props.signOut}>Cerrar Sesión</Button>
      </Flex>
    </View>
  )
}
