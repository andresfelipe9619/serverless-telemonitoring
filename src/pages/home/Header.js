import { Button, Flex, View } from '@aws-amplify/ui-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import useResponsive from '../../hooks/useResponsive'

import './styles.css'

export default function Header (props) {
  const navigate = useNavigate()
  const go2 = path => () => navigate(path)
  const { isMobile } = useResponsive()

  return (
    <View className='header'>
      <Flex width='100%' justifyContent={isMobile ? 'center' : ''}>
        <Button onClick={go2('/')}>🏠 {!isMobile && 'Inicio'}</Button>
        <Button onClick={go2('/profile')}>😎 {!isMobile && 'Perfil'}</Button>
        <Button alignSelf={'flex-end'} onClick={props.signOut}>
          🚪 {!isMobile && 'Cerrar Sesión'}
        </Button>
      </Flex>
    </View>
  )
}
