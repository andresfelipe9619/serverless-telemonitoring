import { useState } from 'react'
import { API, Amplify } from 'aws-amplify'
import { withAuthenticator, Button, Heading, Flex } from '@aws-amplify/ui-react'
import logo from './logo.svg'
import awsExports from './aws-exports'
import './App.css'
import '@aws-amplify/ui-react/styles.css'

Amplify.configure(awsExports)

function App ({ user, signOut }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  async function getTelemonitoringData () {
    try {
      setLoading(true)
      const response = await API.get('api', '/telemonitoring/timestamp')
      console.log('response', response)
      setData(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='App'>
      <Flex
        direction={'column'}
        justifyContent='center'
        alignContent={'center'}
        className='App-header'
      >
        <img src={logo} className='App-logo' alt='logo' />
        <Heading level={1}>Hello {user.username}</Heading>
        {!data.length && (
          <Button onClick={getTelemonitoringData}>
            {loading ? 'Loading...' : 'Get Telemonitoring'}
          </Button>
        )}
        {data.map((item, i) => (
          <Heading level={2}>{i} - {item.device_id}; HB: {item.HeartBeat}; SPO2: {item.Spo2}</Heading>
        ))}
        <Button onClick={signOut}>Sign out</Button>
      </Flex>
    </div>
  )
}

export default withAuthenticator(App)
