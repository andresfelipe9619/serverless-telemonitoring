import React, { useState } from 'react'
import { API } from 'aws-amplify'
import { Alert, Button, Heading, Flex } from '@aws-amplify/ui-react'
import logo from '../../logo.svg'

export default function PatientDetail ({ user, signOut }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function getTelemonitoringData () {
    try {
      setLoading(true)
      const response = await API.get('api', '/telemonitoring/timestamp')
      console.log('response', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Flex
      direction={'column'}
      justifyContent='center'
      alignContent={'center'}
      className='App-header'
    >
      {error && <Alert variation='error'>{error}</Alert>}

      <img src={logo} className='App-logo' alt='logo' />
      <Heading level={1}>Hello {user.username}</Heading>
      {!data.length && (
        <Button onClick={getTelemonitoringData}>
          {loading ? 'Loading...' : 'Get Telemonitoring'}
        </Button>
      )}
      {data.map((item, i) => (
        <Heading level={2}>
          {i} - {item.device_id}; HB: {item.HeartBeat}; SPO2: {item.Spo2}
        </Heading>
      ))}
      <Button onClick={signOut}>Sign out</Button>
    </Flex>
  )
}
