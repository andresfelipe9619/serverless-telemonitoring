import { API } from 'aws-amplify'
import { useCallback, useState } from 'react'

export default function usePatientData () {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [concat, setConcat] = useState(true)

  const getPatientData = useCallback(async function getPatientData (cognito_id) {
    try {
      setLoading(true)
      console.log('cognito_id', cognito_id)
      const PK = 'PATIENT'
      const response = await API.get(
        'TelemonitoringAPI',
        `/app/object/${PK}/${cognito_id}`
      )
      console.log('Profile Data: ', response)
      setData(response)
    } catch (error) {
      console.error(error)
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const assignGeolocation = useCallback(async function assignGeolocation (
    patient,
    location
  ) {
    try {
      setLoading(true)
      const response = await API.put('TelemonitoringAPI', `/app/`, {
        body: {
          ...patient,
          location
        }
      })
      setData(prev => ({ ...prev, location }))
      console.log('Profile Data: ', response)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  },
  [])

  const assignDevice = useCallback(async function assignDevice (
    patient,
    device_id
  ) {
    try {
      setLoading(true)
      const response = await API.put('TelemonitoringAPI', `/app/`, {
        body: {
          ...patient,
          device_id
        }
      })
      setData(prev => ({ ...prev, device_id }))
      setConcat(false)
      console.log('Profile Data: ', response)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  },
  [])

  return [
    { data, loading, error, concat },
    { getPatientData, assignDevice, setConcat, assignGeolocation }
  ]
}
