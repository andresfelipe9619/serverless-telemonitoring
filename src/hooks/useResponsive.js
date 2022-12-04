import { useBreakpointValue } from '@aws-amplify/ui-react'

function useResponsive () {
  const screen = useBreakpointValue(['base', 'sm', 'md', 'large'])
  console.log('screen', screen)
  const isMobile = ['base', 'sm'].includes(screen)
  return { screen, isMobile }
}

export default useResponsive
